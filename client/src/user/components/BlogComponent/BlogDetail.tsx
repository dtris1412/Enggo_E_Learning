import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useBlog } from "../../contexts/blogContext";
import BlogComment from "./BlogComment";

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    currentBlog,
    loading,
    error,
    getBlogBySlug,
    toggleLike,
    comments,
    fetchComments,
  } = useBlog();

  const [likeLoading, setLikeLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();

  useEffect(() => {
    if (slug) {
      getBlogBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (currentBlog) {
      fetchComments(currentBlog.blog_id);
    }
  }, [currentBlog?.blog_id]);

  useEffect(() => {
    // Get current user from localStorage or auth context
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUserId(user.user_id);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = () => {
    return "bg-gray-100 text-gray-700";
  };

  const handleToggleLike = async () => {
    if (!currentBlog) return;

    setLikeLoading(true);
    const result = await toggleLike(currentBlog.blog_id);
    if (!result.success && result.message) {
      alert(result.message);
    }
    setLikeLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentBlog?.blog_title,
        text: currentBlog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link bài viết!");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-solid border-gray-300 border-r-transparent"></div>
        <p className="mt-4 text-gray-500 text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Không tìm thấy bài viết
        </h3>
        <p className="text-gray-600 mb-6">
          {error || "Bài viết không tồn tại"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        {/* Category */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-medium ${getCategoryColor()}`}
          >
            {currentBlog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {currentBlog.blog_title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          {currentBlog.User && (
            <div className="flex items-center gap-2">
              {currentBlog.User.avatar ? (
                <img
                  src={currentBlog.User.avatar}
                  alt={currentBlog.User.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {currentBlog.User.username}
                </p>
                <p className="text-xs text-gray-500">Tác giả</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(currentBlog.created_at)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{currentBlog.views_count} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{currentBlog.likes_count || 0} thích</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{currentBlog.comments_count || 0} bình luận</span>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <img
            src={currentBlog.blog_thumbnail}
            alt={currentBlog.blog_title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-6">
          <p className="text-base text-gray-700 italic">
            {currentBlog.excerpt}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${
              currentBlog.user_liked
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50`}
          >
            <Heart
              className={`h-4 w-4 ${currentBlog.user_liked ? "fill-current" : ""}`}
            />
            <span>{currentBlog.user_liked ? "Đã thích" : "Thích"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: currentBlog.blog_content }}
        />
      </div>

      {/* Comments */}
      <BlogComment
        blog_id={currentBlog.blog_id}
        comments={comments}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default BlogDetail;
