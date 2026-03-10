import React, { useEffect, useState } from "react";
import { useBlog } from "../../contexts/blogContext";
import BlogCard from "./BlogCard";

const BlogList: React.FC = () => {
  const {
    blogs,
    currentPage,
    totalPages,
    loading,
    error,
    fetchBlogsPaginated,
  } = useBlog();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Mẹo học tập", name: "Mẹo học tập" },
    { id: "IELTS", name: "IELTS" },
    { id: "TOEIC", name: "TOEIC" },
    { id: "Ngữ pháp", name: "Ngữ pháp" },
    { id: "Từ vựng", name: "Từ vựng" },
  ];

  useEffect(() => {
    fetchBlogsPaginated(
      "",
      1,
      9,
      selectedCategory === "all" ? undefined : selectedCategory,
      "created_at",
      "DESC",
    );
  }, [selectedCategory]);

  const handlePageChange = (page: number) => {
    fetchBlogsPaginated(
      "",
      page,
      9,
      selectedCategory === "all" ? undefined : selectedCategory,
      "created_at",
      "DESC",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Filter by category */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-solid border-gray-300 border-r-transparent"></div>
          <p className="mt-4 text-gray-500 text-sm">Đang tải bài viết...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-medium">Có lỗi xảy ra</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Blog List */}
      {!loading && !error && (
        <>
          <div className="space-y-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.blog_id} {...blog} />
            ))}
          </div>

          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-600">
                Thử tìm kiếm với từ khóa khác hoặc chọn chuyên mục khác
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white"
              >
                Trước
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm ${
                      currentPage === page
                        ? "bg-gray-800 text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white"
              >
                Tiếp
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
