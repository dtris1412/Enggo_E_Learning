import { useState } from "react";

interface LessonMedia {
  media_id: number;
  order_index: number;
  description: string | null;
  media_type: string;
  media_url: string;
  transcript: string | null;
}

interface LessonMediaGalleryProps {
  media: LessonMedia[];
}

export const LessonMediaGallery = ({ media }: LessonMediaGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  console.log("📸 LessonMediaGallery rendered with media:", media);
  console.log("📊 Media count:", media?.length);

  if (!media || media.length === 0) {
    console.log("⚠️ LessonMediaGallery: No media to display");
    return null;
  }

  const currentMedia = media[selectedMediaIndex];

  const renderMedia = () => {
    switch (currentMedia.media_type.toLowerCase()) {
      case "video":
        return (
          <video
            key={currentMedia.media_id}
            controls
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            style={{ maxHeight: "480px" }}
          >
            <source src={currentMedia.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "image":
        return (
          <img
            src={currentMedia.media_url}
            alt={currentMedia.description || "Lesson media"}
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-contain max-h-[480px]"
          />
        );

      case "audio":
        return (
          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg max-w-2xl mx-auto">
            <audio key={currentMedia.media_id} controls className="w-full">
              <source src={currentMedia.media_url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case "text":
        return (
          <div className="p-4 bg-slate-50 rounded-lg max-w-2xl mx-auto text-center">
            <a
              href={currentMedia.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tải xuống tài liệu
            </a>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-slate-500 max-w-2xl mx-auto">
            Unsupported media type: {currentMedia.media_type}
          </div>
        );
    }
  };

  return (
    <div className="mb-6">
      {/* Media Display */}
      <div className="mb-4">
        {renderMedia()}

        {/* Description */}
        {currentMedia.description && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-700">{currentMedia.description}</p>
          </div>
        )}

        {/* Transcript */}
        {currentMedia.transcript && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">📝 Transcript</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {currentMedia.transcript}
            </p>
          </div>
        )}
      </div>

      {/* Media Navigation */}
      {media.length > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setSelectedMediaIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={selectedMediaIndex === 0}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>

          <div className="flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedMediaIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === selectedMediaIndex
                    ? "bg-blue-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`View media ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setSelectedMediaIndex((prev) =>
                Math.min(media.length - 1, prev + 1),
              )
            }
            disabled={selectedMediaIndex === media.length - 1}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Media Counter */}
      <div className="mt-3 text-center text-xs text-slate-600">
        {selectedMediaIndex + 1} / {media.length}
      </div>
    </div>
  );
};
