import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface UserProfile {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name: string | null;
  user_phone: string | null;
  user_address: string | null;
  avatar: string | null;
  user_status: boolean;
  role: number;
  google_id: string | null;
  facebook_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Profile operations
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: {
    full_name?: string;
    user_phone?: string;
    user_address?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  changePassword: (
    current_password: string,
    new_password: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateUserProfile = async (data: {
    full_name?: string;
    user_phone?: string;
    user_address?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProfile(result.data);
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || "Failed to update profile",
        };
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      return {
        success: false,
        message: err.message || "An error occurred",
      };
    }
  };

  // Change password
  const changePassword = async (
    current_password: string,
    new_password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/user/profile/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ current_password, new_password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || "Failed to change password",
        };
      }
    } catch (err: any) {
      console.error("Error changing password:", err);
      return {
        success: false,
        message: err.message || "An error occurred",
      };
    }
  };

  // Auto-fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchUserProfile,
        updateUserProfile,
        changePassword,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
