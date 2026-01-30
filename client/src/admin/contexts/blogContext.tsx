import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Blog {
  blog_id: number;
  blog_title: string;
  slug: string;
  excerpt: string;
  blog_content: string;
  blog_thumbnail: string;
  category: "Mẹo học tập" | "TOEIC" | "IELTS" | "Ngữ pháp" | "Từ vựng";
  blog_status: "draft" | "published" | "hidden";
  views_count: number;
  user_id: number;
  created_at: string;
  updated_at?: string;
  User?: {
    user_id: number;
    user_name: string;
    user_email: string;
    avatar: string;
  };
}

interface BlogPaginationResult {
  blogs: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface BlogContextType {
  blogs: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  fetchBlogsPaginated: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }) => Promise<void>;
  getBlogById: (blog_id: number) => Promise<Blog | null>;
  getBlogBySlug: (slug: string) => Promise<Blog | null>;
  createBlog: (formData: FormData) => Promise<boolean>;
  updateBlog: (blog_id: number, formData: FormData) => Promise<boolean>;
  updateBlogStatus: (
    blog_id: number,
    blog_status: "draft" | "published" | "hidden",
  ) => Promise<boolean>;
  deleteBlog: (blog_id: number) => Promise<boolean>;
  getLatestBlogs: (limit?: number) => Promise<Blog[]>;
  getPopularBlogs: (limit?: number) => Promise<Blog[]>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchBlogsPaginated = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      category?: string;
      sortBy?: string;
      order?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.category) queryParams.append("category", params.category);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.order) queryParams.append("order", params.order);

        const response = await fetch(
          `${API_URL}/admin/blogs/paginated?${queryParams.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const result = await response.json();
        if (result.success) {
          setBlogs(result.data.blogs || []);
          setPagination(result.data.pagination);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getBlogById = useCallback(async (blog_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${blog_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch blog");
      console.error("Error fetching blog:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/blogs/slug/${slug}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch blog");
      console.error("Error fetching blog:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlog = async (formData: FormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/blogs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create blog");
      console.error("Error creating blog:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (
    blog_id: number,
    formData: FormData,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${blog_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update blog");
      console.error("Error updating blog:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogStatus = async (
    blog_id: number,
    blog_status: "draft" | "published" | "hidden",
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${blog_id}/status`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog_status }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update blog status");
      console.error("Error updating blog status:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blog_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${blog_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
      console.error("Error deleting blog:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLatestBlogs = async (limit = 5): Promise<Blog[]> => {
    try {
      const response = await fetch(`${API_URL}/blogs/latest?limit=${limit}`, {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching latest blogs:", err);
      return [];
    }
  };

  const getPopularBlogs = async (limit = 5): Promise<Blog[]> => {
    try {
      const response = await fetch(`${API_URL}/blogs/popular?limit=${limit}`, {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching popular blogs:", err);
      return [];
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        pagination,
        loading,
        error,
        fetchBlogsPaginated,
        getBlogById,
        getBlogBySlug,
        createBlog,
        updateBlog,
        updateBlogStatus,
        deleteBlog,
        getLatestBlogs,
        getPopularBlogs,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
