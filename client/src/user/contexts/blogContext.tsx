import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface User {
  user_id: number;
  user_name: string;
  email: string;
  avatar: string | null;
}

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
  updated_at: string;
  User?: User;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
}

interface Comment {
  blog_comment_id: number;
  user_id: number;
  blog_id: number;
  parent_comment_id: number | null;
  comment_content: string;
  created_at: string;
  updated_at: string;
  User?: User;
  Replies?: Comment[];
}

interface BlogContextType {
  blogs: Blog[];
  currentBlog: Blog | null;
  totalBlogs: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  // Blog operations
  fetchBlogsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    category?: string,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  getBlogById: (blog_id: number) => Promise<Blog | null>;
  getBlogBySlug: (slug: string) => Promise<Blog | null>;

  // Like operations
  toggleLike: (
    blog_id: number,
  ) => Promise<{ success: boolean; message?: string }>;
  checkUserLiked: (blog_id: number) => Promise<boolean>;

  // Comment operations
  comments: Comment[];
  totalComments: number;
  commentsPage: number;
  commentsTotalPages: number;
  fetchComments: (
    blog_id: number,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  createComment: (
    blog_id: number,
    comment_content: string,
    parent_comment_id?: number | null,
  ) => Promise<{ success: boolean; message?: string; data?: Comment }>;
  updateComment: (
    comment_id: number,
    comment_content: string,
  ) => Promise<{ success: boolean; message?: string }>;
  deleteComment: (
    comment_id: number,
  ) => Promise<{ success: boolean; message?: string }>;
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
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch blogs with pagination
  const fetchBlogsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
      category?: string,
      sortBy = "created_at",
      sortOrder = "DESC",
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (category && category !== "all") params.append("category", category);
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await fetch(
          `${API_URL}/user/blogs?${params.toString()}`,
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
          setBlogs(result.data.blogs);
          setTotalBlogs(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
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

  // Get blog by ID
  const getBlogById = useCallback(async (blog_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/blogs/${blog_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const result = await response.json();
      if (result.success) {
        setCurrentBlog(result.data);
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

  // Get blog by slug
  const getBlogBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/blogs/slug/${slug}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const result = await response.json();
      if (result.success) {
        setCurrentBlog(result.data);
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

  // Toggle like
  const toggleLike = async (
    blog_id: number,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return {
          success: false,
          message: "Please login to like blog posts",
        };
      }

      const response = await fetch(`${API_URL}/user/blogs/${blog_id}/like`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: "Please login to like blog posts",
          };
        }
        throw new Error("Failed to toggle like");
      }

      const result = await response.json();

      // Update current blog if it's the one being liked
      if (currentBlog && currentBlog.blog_id === blog_id) {
        setCurrentBlog({
          ...currentBlog,
          user_liked: result.data.liked,
          likes_count: result.data.liked
            ? (currentBlog.likes_count || 0) + 1
            : Math.max((currentBlog.likes_count || 0) - 1, 0),
        });
      }

      // Update in blogs list
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.blog_id === blog_id
            ? {
                ...blog,
                user_liked: result.data.liked,
                likes_count: result.data.liked
                  ? (blog.likes_count || 0) + 1
                  : Math.max((blog.likes_count || 0) - 1, 0),
              }
            : blog,
        ),
      );

      return { success: true, message: result.message };
    } catch (err: any) {
      console.error("Error toggling like:", err);
      return { success: false, message: err.message };
    }
  };

  // Check if user liked
  const checkUserLiked = async (blog_id: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;

      const response = await fetch(
        `${API_URL}/user/blogs/${blog_id}/likes/check`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) return false;

      const result = await response.json();
      return result.success ? result.data.liked : false;
    } catch (err) {
      console.error("Error checking like status:", err);
      return false;
    }
  };

  // Fetch comments
  const fetchComments = useCallback(
    async (blog_id: number, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const response = await fetch(
          `${API_URL}/user/blogs/${blog_id}/comments?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const result = await response.json();
        if (result.success) {
          setComments(result.data.comments);
          setTotalComments(result.data.totalItems);
          setCommentsPage(result.data.currentPage);
          setCommentsTotalPages(result.data.totalPages);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch comments");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create comment
  const createComment = async (
    blog_id: number,
    comment_content: string,
    parent_comment_id: number | null = null,
  ): Promise<{ success: boolean; message?: string; data?: Comment }> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return {
          success: false,
          message: "Please login to comment",
        };
      }

      const response = await fetch(
        `${API_URL}/user/blogs/${blog_id}/comments`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ comment_content, parent_comment_id }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: "Please login to comment",
          };
        }
        throw new Error("Failed to create comment");
      }

      const result = await response.json();

      if (result.success) {
        // Refresh comments
        await fetchComments(blog_id, commentsPage);

        // Update comment count in current blog
        if (currentBlog && currentBlog.blog_id === blog_id) {
          setCurrentBlog({
            ...currentBlog,
            comments_count: (currentBlog.comments_count || 0) + 1,
          });
        }
      }

      return {
        success: result.success,
        message: result.message,
        data: result.data,
      };
    } catch (err: any) {
      console.error("Error creating comment:", err);
      return { success: false, message: err.message };
    }
  };

  // Update comment
  const updateComment = async (
    comment_id: number,
    comment_content: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return {
          success: false,
          message: "Please login to update comment",
        };
      }

      const response = await fetch(`${API_URL}/user/comments/${comment_id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment_content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const result = await response.json();

      if (result.success) {
        // Update comment in local state
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.blog_comment_id === comment_id) {
              return {
                ...comment,
                comment_content,
                updated_at: new Date().toISOString(),
              };
            }
            // Update in replies
            if (comment.Replies) {
              return {
                ...comment,
                Replies: comment.Replies.map((reply) =>
                  reply.blog_comment_id === comment_id
                    ? {
                        ...reply,
                        comment_content,
                        updated_at: new Date().toISOString(),
                      }
                    : reply,
                ),
              };
            }
            return comment;
          }),
        );
      }

      return { success: result.success, message: result.message };
    } catch (err: any) {
      console.error("Error updating comment:", err);
      return { success: false, message: err.message };
    }
  };

  // Delete comment
  const deleteComment = async (
    comment_id: number,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return {
          success: false,
          message: "Please login to delete comment",
        };
      }

      const response = await fetch(`${API_URL}/user/comments/${comment_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const result = await response.json();

      if (result.success) {
        // Remove comment from local state
        setComments((prevComments) =>
          prevComments.filter((comment) => {
            // Don't include deleted comment
            if (comment.blog_comment_id === comment_id) return false;
            // Filter out deleted replies
            if (comment.Replies) {
              comment.Replies = comment.Replies.filter(
                (reply) => reply.blog_comment_id !== comment_id,
              );
            }
            return true;
          }),
        );

        // Update comment count in current blog
        if (currentBlog) {
          setCurrentBlog({
            ...currentBlog,
            comments_count: Math.max((currentBlog.comments_count || 0) - 1, 0),
          });
        }
      }

      return { success: result.success, message: result.message };
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        currentBlog,
        totalBlogs,
        currentPage,
        totalPages,
        loading,
        error,
        fetchBlogsPaginated,
        getBlogById,
        getBlogBySlug,
        toggleLike,
        checkUserLiked,
        comments,
        totalComments,
        commentsPage,
        commentsTotalPages,
        fetchComments,
        createComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
