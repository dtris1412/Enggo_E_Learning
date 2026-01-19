import { useEffect, useState } from "react";
import { useLessonMedia, LessonMedia } from "../../contexts/lessonMediaContext";
import {
  Plus,
  Edit,
  Trash2,
  Video,
  Volume2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import AddLessonMediaModal from "./AddLessonMediaModal";
import EditLessonMediaModal from "./EditLessonMediaModal";

// Component to render text file content
const TextFileRenderer: React.FC<{ url: string }> = ({ url }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error loading text file:", error);
        setContent("Không thể tải nội dung file");
      } finally {
        setLoading(false);
      }
    };

    fetchTextContent();
  }, [url]);

  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  // Check if content is HTML (from .docx conversion)
  const isHTML = content.trim().startsWith("<");

  return (
    <div className="bg-gray-50 p-4 rounded">
      {isHTML ? (
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};

interface LessonMediaManagerProps {
  lessonId: number;
}

const LessonMediaManager: React.FC<LessonMediaManagerProps> = ({
  lessonId,
}) => {
  const { medias, loading, error, fetchMediasByLessonId, deleteMedia } =
    useLessonMedia();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<LessonMedia | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchMediasByLessonId(lessonId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleDelete = async (mediaId: number) => {
    const success = await deleteMedia(mediaId);
    if (success) {
      // List will auto-refresh from context
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-purple-600" />;
      case "audio":
        return <Volume2 className="h-5 w-5 text-blue-600" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-600" />;
      case "text":
        return <FileText className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const renderMediaPreview = (media: LessonMedia) => {
    switch (media.media_type) {
      case "video":
        return (
          <video
            src={media.media_url}
            controls
            className="w-full max-h-60 rounded"
          />
        );
      case "audio":
        return <audio src={media.media_url} controls className="w-full" />;
      case "image":
        return (
          <img
            src={media.media_url}
            alt={media.description || "Media"}
            className="w-full max-h-60 object-cover rounded"
          />
        );
      case "text":
        return <TextFileRenderer url={media.media_url} />;
      default:
        return <p className="text-gray-500">Không có preview</p>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm Media</span>
        </button>
      </div>

      {/* Media List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : medias.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>Chưa có media nào cho bài học này</p>
          <p className="text-sm mt-1">
            Nhấn "Thêm Media" để thêm nội dung cho bài học
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {medias.map((media) => (
            <div
              key={media.media_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Media Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getMediaIcon(media.media_type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {media.media_type.toUpperCase()} - Thứ tự:{" "}
                      {media.order_index}
                    </p>
                    {media.description && (
                      <p className="text-sm text-gray-600">
                        {media.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMedia(media)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(media.media_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Media Preview */}
              <div className="mt-3">{renderMediaPreview(media)}</div>

              {/* Transcription */}
              {media.transcription && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700">
                    Transcription:
                  </p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {media.transcription}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>ID: {media.media_id}</span>
                {media.created_at && (
                  <span>
                    Tạo lúc:{" "}
                    {new Date(media.created_at).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddLessonMediaModal
        isOpen={showAddModal}
        lessonId={lessonId}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Context will auto-refresh
        }}
      />

      <EditLessonMediaModal
        isOpen={!!editingMedia}
        media={editingMedia}
        onClose={() => setEditingMedia(null)}
        onSuccess={() => {
          // Context will auto-refresh
        }}
      />
    </div>
  );
};

export default LessonMediaManager;
