import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useBlog } from "../../contexts/blogContext";
import BlogCard from "./BlogCard";
import BlogLayout from "./BlogLayout";
import Pagination from "../../../shared/components/Pagination";

const CATEGORIES = [
  { id: "all", name: "Tất cả" },
  { id: "Mẹo học tập", name: "Mẹo học tập" },
  { id: "IELTS", name: "IELTS" },
  { id: "TOEIC", name: "TOEIC" },
  { id: "Ngữ pháp", name: "Ngữ pháp" },
  { id: "Từ vựng", name: "Từ vựng" },
];

const BlogList: React.FC = () => {
  const { blogs, totalPages, loading, error, fetchBlogsPaginated } = useBlog();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Derive page from URL (?page=N), default 1
  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Fetch whenever URL page, category, or search changes
  useEffect(() => {
    fetchBlogsPaginated(
      searchTerm,
      urlPage,
      9,
      selectedCategory === "all" ? undefined : selectedCategory,
      "created_at",
      "DESC",
    );
  }, [urlPage, selectedCategory, searchTerm]);

  // Reset to page 1 in URL when category or search changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  };

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  return (
    <BlogLayout
      categories={CATEGORIES}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      onSearch={handleSearch}
    >
      <div>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-solid border-slate-300 border-r-transparent"></div>
            <p className="mt-4 text-slate-500 text-sm">Đang tải bài viết...</p>
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
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-slate-500">
                  Thử tìm kiếm với từ khóa khác hoặc chọn chuyên mục khác
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              buildPageUrl={buildPageUrl}
              className="mt-8"
            />
          </>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogList;
