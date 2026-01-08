import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name?: string;
  user_phone?: string;
  user_address?: string;
  avatar?: string;
  user_status: boolean;
  role: number;
  created_at?: string;
  updated_at?: string;
}

interface UserContextType {
  users: User[];
  isLoading: boolean;
  total: number;
  getAllUsers: () => Promise<{ success: boolean; message?: string }>;
  getUsersPaginated: (
    search?: string,
    limit?: number,
    page?: number,
    role?: number | string,
    user_status?: boolean | string
  ) => Promise<{ success: boolean; message?: string }>;
  getUserById: (
    user_id: number
  ) => Promise<{ success: boolean; data?: User; message?: string }>;
  createUser: (userData: {
    user_name: string;
    user_email: string;
    user_password: string;
    full_name?: string;
    user_phone?: string;
    user_address?: string;
    avatar?: string;
    user_status?: boolean;
    role?: number;
  }) => Promise<{ success: boolean; message?: string }>;
  updateUser: (
    user_id: number,
    userData: {
      full_name?: string;
      user_phone?: string;
      user_address?: string;
    }
  ) => Promise<{ success: boolean; message?: string }>;
  lockUser: (
    user_id: number
  ) => Promise<{ success: boolean; message?: string }>;
  unlockUser: (
    user_id: number
  ) => Promise<{ success: boolean; message?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found in localStorage");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/users`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      // Kiểm tra unauthorized
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return { success: false, message: "Phiên đăng nhập đã hết hạn" };
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setTotal(data.data.length);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Get all users error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsersPaginated = useCallback(
    async (
      search: string = "",
      limit: number = 10,
      page: number = 1,
      role?: number | string,
      user_status?: boolean | string
    ) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          limit: limit.toString(),
          page: page.toString(),
        });

        if (role !== undefined && role !== "") {
          params.append("role", role.toString());
        }

        if (user_status !== undefined && user_status !== "") {
          params.append("user_status", user_status.toString());
        }

        const response = await fetch(
          `${apiUrl}/admin/users/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return { success: false, message: "Phiên đăng nhập đã hết hạn" };
        }

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
          setTotal(data.total);
          return { success: true };
        } else {
          return { success: false, message: data.message };
        }
      } catch (error) {
        console.error("Get users paginated error:", error);
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getUserById = useCallback(async (user_id: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${user_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      // Kiểm tra unauthorized
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return { success: false, message: "Phiên đăng nhập đã hết hạn" };
      }

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Get user by id error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  }, []);

  const createUser = useCallback(
    async (userData: {
      user_name: string;
      user_email: string;
      user_password: string;
      full_name?: string;
      user_phone?: string;
      user_address?: string;
      avatar?: string;
      user_status?: boolean;
      role?: number;
    }) => {
      try {
        const response = await fetch(`${apiUrl}/admin/users`, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message };
        }
      } catch (error) {
        console.error("Create user error:", error);
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
      }
    },
    []
  );

  const updateUser = useCallback(
    async (
      user_id: number,
      userData: {
        full_name?: string;
        user_phone?: string;
        user_address?: string;
      }
    ) => {
      try {
        const response = await fetch(`${apiUrl}/admin/users/${user_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message };
        }
      } catch (error) {
        console.error("Update user error:", error);
        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
      }
    },
    []
  );

  const lockUser = useCallback(async (user_id: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${user_id}/lock`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Lock user error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  }, []);

  const unlockUser = useCallback(async (user_id: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${user_id}/unlock`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Unlock user error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  }, []);

  const value: UserContextType = {
    users,
    isLoading,
    total,
    getAllUsers,
    getUsersPaginated,
    getUserById,
    createUser,
    updateUser,
    lockUser,
    unlockUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
