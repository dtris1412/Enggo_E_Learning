import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLesson } from "../contexts/lessonContext";
import {
  LessonMediaProvider,
  useLessonMedia,
} from "../contexts/lessonMediaContext";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  Award,
  Save,
  Edit,
  Volume2,
  FileText,
  Eye,
} from "lucide-react";
import LessonMediaManager from "../components/LessonManagement/LessonMediaManager";
import LessonQuestionManager from "../components/LessonManagement/LessonQuestionManager";
import { LessonQuestionProvider } from "../contexts/lessonQuestionContext";

const LessonDetail = () => {
  const { lesson_id } = useParams<{ lesson_id: string }>();
  const navigate = useNavigate();
  const { getLessonById, updateLesson } = useLesson();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadLessonDetail();
  }, [lesson_id]);

  const loadLessonDetail = async () => {
    if (!lesson_id) return;
    setLoading(true);
    try {
      const data = await getLessonById(parseInt(lesson_id));
      if (data) {
        setLesson(data);
        setFormData({
          lesson_title: data.lesson_title,
          lesson_type: data.lesson_type,
          difficulty_level: data.difficulty_level,
          lesson_content: data.lesson_content,
          is_exam_format: data.is_exam_format,
          estimated_time: data.estimated_time,
          skill_id: data.skill_id,
        });
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!lesson_id) return;
    const success = await updateLesson(
      parseInt(lesson_id),
      formData.lesson_title,
      formData.lesson_type,
      formData.difficulty_level,
      formData.lesson_content,
      formData.is_exam_format,
      formData.estimated_time,
      formData.skill_id,
    );
    if (success) {
      setEditing(false);
      loadLessonDetail();
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reading":
        return <BookOpen className="h-5 w-5" />;
      case "listening":
        return <Volume2 className="h-5 w-5" />;
      case "writing":
        return <Edit className="h-5 w-5" />;
      case "speaking":
        return <Volume2 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Không tìm thấy bài học</p>
        <button
          onClick={() => navigate("/admin/lessons")}
          className="text-blue-600 hover:underline"
        >
          Quay lại danh sách bài học
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/lessons")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {previewMode ? "Xem trước (Chế độ học viên)" : "Chi tiết bài học"}
            </h1>
            <p className="text-gray-600 mt-1">{lesson.lesson_title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              previewMode
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Eye className="h-5 w-5" />
            <span>{previewMode ? "Chế độ quản lý" : "Xem trước"}</span>
          </button>
          {!editing && !previewMode && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
        {editing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleUpdateLesson}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Lưu</span>
            </button>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin bài học</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lesson Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bài học
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.lesson_title}
                onChange={(e) =>
                  setFormData({ ...formData, lesson_title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{lesson.lesson_title}</p>
            )}
          </div>

          {/* Lesson Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại bài học
            </label>
            {editing ? (
              <select
                value={formData.lesson_type}
                onChange={(e) =>
                  setFormData({ ...formData, lesson_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            ) : (
              <div className="flex items-center space-x-2">
                {getTypeIcon(lesson.lesson_type)}
                <span className="capitalize">{lesson.lesson_type}</span>
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó
            </label>
            {editing ? (
              <select
                value={formData.difficulty_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty_level: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(lesson.difficulty_level)}`}
              >
                {lesson.difficulty_level}
              </span>
            )}
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian ước tính (phút)
            </label>
            {editing ? (
              <input
                type="number"
                value={formData.estimated_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_time: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>{lesson.estimated_time} phút</span>
              </div>
            )}
          </div>

          {/* Is Exam Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Định dạng bài thi
            </label>
            {editing ? (
              <input
                type="checkbox"
                checked={formData.is_exam_format}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_exam_format: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            ) : (
              <span>{lesson.is_exam_format ? "Có" : "Không"}</span>
            )}
          </div>

          {/* Lesson Content */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài học
            </label>
            {editing ? (
              <textarea
                value={formData.lesson_content}
                onChange={(e) =>
                  setFormData({ ...formData, lesson_content: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">
                {lesson.lesson_content}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Media Manager */}
      {!previewMode ? (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quản lý Media bài học
            </h2>
            <LessonMediaProvider>
              <LessonMediaManager lessonId={parseInt(lesson_id!)} />
            </LessonMediaProvider>
          </div>

          {/* Lesson Question Manager */}
          <div className="bg-white rounded-lg shadow p-6">
            <LessonQuestionProvider>
              <LessonQuestionManager lessonId={parseInt(lesson_id!)} />
            </LessonQuestionProvider>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Xem trước giao diện học viên
          </h2>
          <div className="max-w-4xl mx-auto">
            {/* Student View Preview - Simple media display */}
            <LessonMediaProvider>
              <StudentLessonPreview
                lessonId={parseInt(lesson_id!)}
                lesson={lesson}
              />
            </LessonMediaProvider>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Student Preview Component
const StudentLessonPreview: React.FC<{ lessonId: number; lesson: any }> = ({
  lessonId,
  lesson,
}) => {
  const { medias, loading, fetchMediasByLessonId } = useLessonMedia();

  useEffect(() => {
    fetchMediasByLessonId(lessonId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  const sortedMedias = [...medias].sort(
    (a, b) => a.order_index - b.order_index,
  );

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {lesson.lesson_title}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {lesson.estimated_time} phút
          </span>
          <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {lesson.lesson_type}
          </span>
          <span
            className={`capitalize px-2 py-1 rounded ${
              lesson.difficulty_level === "beginner"
                ? "bg-green-100 text-green-800"
                : lesson.difficulty_level === "intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {lesson.difficulty_level}
          </span>
        </div>
      </div>

      {/* Lesson Content */}
      {lesson.lesson_content && (
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">
            {lesson.lesson_content}
          </p>
        </div>
      )}

      {/* Media Content */}
      {sortedMedias.length > 0 && (
        <div className="space-y-6">
          {sortedMedias.map((media, index) => (
            <div key={media.media_id} className="border rounded-lg p-4">
              {/* Media Description */}
              {media.description && (
                <h3 className="font-semibold text-lg mb-3">
                  {media.description}
                </h3>
              )}

              {/* Media Content */}
              {media.media_type === "video" && (
                <video
                  src={media.media_url}
                  controls
                  className="w-full rounded"
                />
              )}
              {media.media_type === "audio" && (
                <audio src={media.media_url} controls className="w-full" />
              )}
              {media.media_type === "image" && (
                <img
                  src={media.media_url}
                  alt={media.description || ""}
                  className="w-full rounded"
                />
              )}
              {media.media_type === "text" && (
                <TextFileRenderer url={media.media_url} />
              )}

              {/* Transcription */}
              {media.transcription && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 font-medium">
                    Xem transcript
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {media.transcription}
                    </p>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
        <pre className="text-gray-700 whitespace-pre-wrap font-sans">
          {content}
        </pre>
      )}
    </div>
  );
};

export default LessonDetail;
