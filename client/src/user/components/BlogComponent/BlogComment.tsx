import React, { useState } from "react";
import { MessageSquare, User, Edit, Trash2, Reply } from "lucide-react";
import { useBlog } from "../../contexts/blogContext";

interface User {
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
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

interface BlogCommentProps {
  blog_id: number;
  comments: Comment[];
  currentUserId?: number;
}

const BlogComment: React.FC<BlogCommentProps> = ({
  blog_id,
  comments,
  currentUserId,
}) => {
  const { createComment, updateComment, deleteComment, fetchComments } =
    useBlog();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const result = await createComment(blog_id, newComment.trim());
    if (result.success) {
      setNewComment("");
      await fetchComments(blog_id);
    } else {
      alert(result.message || "Không thể tạo bình luận");
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    const result = await createComment(blog_id, replyContent.trim(), parentId);
    if (result.success) {
      setReplyContent("");
      setReplyTo(null);
      await fetchComments(blog_id);
    } else {
      alert(result.message || "Không thể tạo phản hồi");
    }
    setSubmitting(false);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim() || submitting) return;

    setSubmitting(true);
    const result = await updateComment(commentId, editContent.trim());
    if (result.success) {
      setEditingId(null);
      setEditContent("");
      await fetchComments(blog_id);
    } else {
      alert(result.message || "Không thể cập nhật bình luận");
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    setSubmitting(true);
    const result = await deleteComment(commentId);
    if (result.success) {
      await fetchComments(blog_id);
    } else {
      alert(result.message || "Không thể xóa bình luận");
    }
    setSubmitting(false);
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.blog_comment_id);
    setEditContent(comment.comment_content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => {
    const isEditing = editingId === comment.blog_comment_id;
    const isOwner = currentUserId === comment.user_id;

    return (
      <div className={`${isReply ? "ml-12 mt-4" : "mb-6"}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.User?.avatar ? (
              <img
                src={comment.User.avatar}
                alt={comment.User.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {comment.User?.username || "User"}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDate(comment.created_at)}
                  </span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="text-xs text-gray-400 ml-2">
                      (đã chỉnh sửa)
                    </span>
                  )}
                </div>

                {/* Actions for owner */}
                {isOwner && !isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-gray-500 hover:text-blue-600 p-1"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteComment(comment.blog_comment_id)
                      }
                      className="text-gray-500 hover:text-red-600 p-1"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {isEditing ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        handleUpdateComment(comment.blog_comment_id)
                      }
                      disabled={submitting}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.comment_content}
                </p>
              )}
            </div>

            {/* Reply Button */}
            {!isEditing && currentUserId && (
              <button
                onClick={() => setReplyTo(comment.blog_comment_id)}
                className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 mt-2"
              >
                <Reply className="h-3 w-3" />
                Trả lời
              </button>
            )}

            {/* Reply Form */}
            {replyTo === comment.blog_comment_id && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSubmitReply(comment.blog_comment_id)}
                    disabled={submitting || !replyContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Gửi
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.Replies && comment.Replies.length > 0 && (
              <div className="mt-4">
                {comment.Replies.map((reply) => (
                  <CommentItem
                    key={reply.blog_comment_id}
                    comment={reply}
                    isReply
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Bình luận ({comments.length})
      </h3>

      {/* New Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {submitting ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Vui lòng{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              đăng nhập
            </a>{" "}
            để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.blog_comment_id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComment;
