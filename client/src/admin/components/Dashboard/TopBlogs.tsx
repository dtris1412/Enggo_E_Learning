import React from "react";
import { Eye, TrendingUp } from "lucide-react";

interface Blog {
  blog_id: number;
  blog_title: string;
  category: string;
  views_count: number;
  created_at: string;
  User: {
    user_name: string;
    full_name: string;
  };
}

interface TopBlogsProps {
  blogs: Blog[];
  loading?: boolean;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  return `${Math.floor(diffWeeks / 4)} tháng trước`;
};

const TopBlogs: React.FC<TopBlogsProps> = ({ blogs, loading = false }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3">Top Blogs</h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có blog nào
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.blog_id}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {blog.blog_title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {blog.User.full_name || blog.User.user_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {blog.views_count.toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {timeAgo(blog.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopBlogs;
