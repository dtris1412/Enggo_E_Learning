import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../contexts/blogContext";
import MDEditor from "@uiw/react-md-editor";
import {
  Calendar,
  User,
  Eye,
  Tag,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getBlogBySlug, deleteBlog, loading } = useBlog();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    if (slug) {
      const data = await getBlogBySlug(slug);
      setBlog(data);
    }
  };

  const handleDelete = async () => {
    if (blog && window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      const success = await deleteBlog(blog.blog_id);
      if (success) {
        navigate("/admin/news");
      }
    }
  };

  const handleEdit = () => {
    if (blog) {
      navigate("/admin/news", { state: { editBlogId: blog.blog_id } });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "hidden":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      case "hidden":
        return "Ẩn";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg mb-4">
          Không tìm thấy bài viết
        </div>
        <button
          onClick={() => navigate("/admin/news")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/news")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa bài viết
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Thumbnail */}
        {blog.blog_thumbnail && (
          <div className="w-full h-96 overflow-hidden">
            <img
              src={blog.blog_thumbnail}
              alt={blog.blog_title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                blog.blog_status,
              )}`}
            >
              {getStatusText(blog.blog_status)}
            </span>

            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {blog.category}
            </span>

            <div className="flex items-center text-gray-600 text-sm">
              <User className="h-4 w-4 mr-1" />
              {blog.User?.user_name || "Unknown"}
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(blog.created_at).toLocaleDateString("vi-VN")}
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <Eye className="h-4 w-4 mr-1" />
              {blog.views_count} lượt xem
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.blog_title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-8 italic">{blog.excerpt}</p>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Markdown Content */}
          <div data-color-mode="light" className="prose max-w-none">
            <MDEditor.Markdown
              source={blog.blog_content}
              style={{ whiteSpace: "pre-wrap", backgroundColor: "white" }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Cập nhật lần cuối:{" "}
                {new Date(blog.updated_at || blog.created_at).toLocaleString(
                  "vi-VN",
                )}
              </div>
              <div className="text-sm text-gray-500">Slug: {blog.slug}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
