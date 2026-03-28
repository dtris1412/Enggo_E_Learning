import React from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  user_id: number;
  user_name: string;
  email: string;
  avatar: string | null;
}

interface BlogCardProps {
  blog_id: number;
  blog_title: string;
  slug: string;
  excerpt: string;
  blog_thumbnail: string;
  category: string;
  views_count: number;
  created_at: string;
  User?: User;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog_title,
  slug,
  excerpt,
  blog_thumbnail,
  category,
  created_at,
  User: author,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      "Mớo học tập": "bg-purple-100 text-purple-700",
      TOEIC: "bg-emerald-100 text-emerald-700",
      IELTS: "bg-violet-100 text-violet-700",
      "Ngữ pháp": "bg-amber-100 text-amber-700",
      "Từ vựng": "bg-orange-100 text-orange-700",
      HSK: "bg-rose-100 text-rose-700",
    };
    return colors[cat] || "bg-slate-100 text-slate-700";
  };

  const handleClick = () => {
    navigate(`/blog/${slug}`);
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Thumbnail - Left side */}
        <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded">
          <img
            src={blog_thumbnail}
            alt={blog_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold ${getCategoryColor(category)}`}
            >
              {category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content - Right side */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Title & Excerpt */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
              {blog_title}
            </h3>
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">
              {excerpt}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            {author && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                <span className="font-medium">{author.user_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDate(created_at)} bởi{" "}
                {author ? author.user_name : "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
