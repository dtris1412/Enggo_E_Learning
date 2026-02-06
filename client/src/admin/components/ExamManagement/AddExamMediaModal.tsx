import { useState } from "react";
import { X, Music } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface AddExamMediaModalProps {
  isOpen: boolean;
  examId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddExamMediaModal = ({
  isOpen,
  examId,
  onClose,
  onSuccess,
}: AddExamMediaModalProps) => {
  const { uploadExamAudio, createExamMedia, loading, error } = useExam();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration));
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Vui lòng chọn file audio để upload");
      return;
    }

    setUploading(true);

    try {
      // Upload audio file
      const audioUrl = await uploadExamAudio(selectedFile);
      if (audioUrl) {
        await createExamMedia({
          exam_id: examId,
          audio_url: audioUrl,
          duration: duration,
        });
        onSuccess();
        resetForm();
      }
    } catch (err) {
      console.error("Error uploading audio:", err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDuration(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Thêm audio Listening cho đề thi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn file audio <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".mp3,.wav,.ogg,.webm"
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Music className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Chọn file audio (MP3, WAV, OGG, WEBM)
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    File đã chọn:
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                  {duration > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Thời lượng: {Math.floor(duration / 60)}:
                      {(duration % 60).toString().padStart(2, "0")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Duration (manual override) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời lượng (giây) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Thời lượng sẽ tự động điền khi chọn file..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !selectedFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading || uploading ? "Đang upload..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamMediaModal;
