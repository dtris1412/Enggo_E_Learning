import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useBlog } from "../../contexts/blogContext";
import MDEditor from "@uiw/react-md-editor";

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogId: number;
}

const EditBlogModal = ({
  isOpen,
  onClose,
  onSuccess,
  blogId,
}: EditBlogModalProps) => {
  const { getBlogById, updateBlog, loading } = useBlog();
  const [formData, setFormData] = useState({
    blog_title: "",
    excerpt: "",
    blog_content: "",
    category: "Mẹo học tập" as
      | "Mẹo học tập"
      | "TOEIC"
      | "IELTS"
      | "Ngữ pháp"
      | "Từ vựng",
    blog_status: "draft" as "draft" | "published" | "hidden",
  });
  const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingBlog, setLoadingBlog] = useState(false);

  useEffect(() => {
    if (isOpen && blogId) {
      loadBlog();
    }
  }, [isOpen, blogId]);

  const loadBlog = async () => {
    setLoadingBlog(true);
    const blog = await getBlogById(blogId);
    if (blog) {
      setFormData({
        blog_title: blog.blog_title,
        excerpt: blog.excerpt,
        blog_content: blog.blog_content,
        category: blog.category,
        blog_status: blog.blog_status,
      });
      setCurrentThumbnail(blog.blog_thumbnail || "");
    }
    setLoadingBlog(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, thumbnail: "Ảnh không được vượt quá 5MB" });
        return;
      }
      setNewThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.blog_title.trim())
      newErrors.blog_title = "Tiêu đề không được để trống";
    if (!formData.excerpt.trim())
      newErrors.excerpt = "Mô tả ngắn không được để trống";
    if (!formData.blog_content.trim())
      newErrors.blog_content = "Nội dung không được để trống";
    if (!formData.category) newErrors.category = "Vui lòng chọn danh mục";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append("blog_title", formData.blog_title);
    data.append("excerpt", formData.excerpt);
    data.append("blog_content", formData.blog_content);
    data.append("category", formData.category);
    data.append("blog_status", formData.blog_status);

    if (newThumbnail) {
      data.append("file", newThumbnail);
    }

    const success = await updateBlog(blogId, data);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    setNewThumbnail(null);
    setThumbnailPreview("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa bài viết
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingBlog ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.blog_title}
                  onChange={(e) =>
                    setFormData({ ...formData, blog_title: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.blog_title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tiêu đề bài viết..."
                />
                {errors.blog_title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.blog_title}
                  </p>
                )}
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="Mẹo học tập">Mẹo học tập</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="Ngữ pháp">Ngữ pháp</option>
                    <option value="Từ vựng">Từ vựng</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.blog_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blog_status: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.excerpt ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mô tả ngắn về bài viết..."
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="space-y-4">
                  {/* Current Thumbnail */}
                  {currentThumbnail && !thumbnailPreview && (
                    <div className="relative inline-block">
                      <img
                        src={currentThumbnail}
                        alt="Current thumbnail"
                        className="h-32 w-auto object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Ảnh hiện tại</p>
                    </div>
                  )}

                  {/* New Thumbnail Preview */}
                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="New thumbnail"
                        className="h-32 w-auto object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewThumbnail(null);
                          setThumbnailPreview("");
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Ảnh mới</p>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {currentThumbnail || thumbnailPreview
                          ? "Click để thay đổi ảnh"
                          : "Click để tải ảnh lên"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG tối đa 5MB
                      </p>
                    </label>
                  </div>
                  {errors.thumbnail && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.thumbnail}
                    </p>
                  )}
                </div>
              </div>

              {/* Content - Markdown Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài viết (Markdown){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div data-color-mode="light">
                  <MDEditor
                    value={formData.blog_content}
                    onChange={(value) =>
                      setFormData({ ...formData, blog_content: value || "" })
                    }
                    height={400}
                    preview="edit"
                    hideToolbar={false}
                    enableScroll={true}
                    visibleDragbar={true}
                  />
                </div>
                {errors.blog_content && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.blog_content}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || loadingBlog}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
