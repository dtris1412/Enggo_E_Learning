const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

// Auto-refresh token if needed
export const getValidToken = async (): Promise<string | null> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    handleLogout();
    return null;
  }

  // Check if token is expired or about to expire (within 5 minutes)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // If token expires in less than 5 minutes, try to refresh
    if (timeUntilExpiry < 5 * 60 * 1000) {
      const newToken = await refreshAccessToken();
      return newToken || token; // Return new token or fallback to old one
    }

    return token;
  } catch (error) {
    console.error("Error checking token:", error);
    return token;
  }
};

// Refresh access token using refresh token from cookie
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // Include cookies (refresh token)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
    } else if (response.status === 401) {
      // Refresh token expired or invalid
      handleLogout();
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Handle logout - clear all auth data
export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  // Redirect to login page if not already there
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

// Fetch with auto token refresh and error handling
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  // Get valid token (will refresh if needed)
  const token = await getValidToken();

  if (!token) {
    throw new Error("No valid authentication token");
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Make request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    // Try to refresh token once
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });

      // If still unauthorized, logout
      if (retryResponse.status === 401 || retryResponse.status === 403) {
        handleLogout();
      }

      return retryResponse;
    } else {
      // Refresh failed, logout
      handleLogout();
      throw new Error("Authentication failed");
    }
  }

  return response;
};

// Setup periodic token refresh check
export const setupTokenRefreshInterval = () => {
  // Check every 4 minutes
  setInterval(
    async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !isTokenExpired(token)) {
        await getValidToken(); // This will refresh if needed
      }
    },
    4 * 60 * 1000,
  );
};
