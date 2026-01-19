import { createContext, useContext, useState, ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const UPLOAD_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

export interface LessonMedia {
  media_id: number;
  lesson_id: number;
  order_index: number;
  description: string | null;
  media_type: string;
  media_url: string;
  transcription: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LessonMediaContextType {
  medias: LessonMedia[];
  loading: boolean;
  error: string | null;
  uploadingFile: boolean;
  fetchMediasByLessonId: (lessonId: number) => Promise<void>;
  createMedia: (
    lessonId: number,
    data: {
      order_index: number;
      description: string;
      media_type: string;
      media_url: string;
      transcription: string;
    },
  ) => Promise<boolean>;
  updateMedia: (
    mediaId: number,
    data: {
      order_index: number;
      description: string;
      media_type: string;
      media_url: string;
      transcription: string;
    },
  ) => Promise<boolean>;
  deleteMedia: (mediaId: number) => Promise<boolean>;
  uploadFile: (
    file: File,
    mediaType: "video" | "audio" | "image" | "text",
  ) => Promise<string | null>;
}

const LessonMediaContext = createContext<LessonMediaContextType | undefined>(
  undefined,
);

export const useLessonMedia = () => {
  const context = useContext(LessonMediaContext);
  if (!context) {
    throw new Error("useLessonMedia must be used within a LessonMediaProvider");
  }
  return context;
};

export const LessonMediaProvider = ({ children }: { children: ReactNode }) => {
  const [medias, setMedias] = useState<LessonMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchMediasByLessonId = async (lessonId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lessons/${lessonId}/medias`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch medias");
      }

      const result = await response.json();
      if (result.success) {
        setMedias(result.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch medias");
      console.error("Error fetching medias:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    mediaType: "video" | "audio" | "image" | "text",
  ): Promise<string | null> => {
    setUploadingFile(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      if (mediaType === "video") {
        formData.append("video", file);
      } else if (mediaType === "audio") {
        formData.append("audio", file);
      } else if (mediaType === "image") {
        formData.append("images", file);
      } else if (mediaType === "text") {
        formData.append("textFile", file);
      }

      let endpoint = "";
      if (mediaType === "video") {
        endpoint = `${UPLOAD_URL}/api/upload/lesson/video`;
      } else if (mediaType === "audio") {
        endpoint = `${UPLOAD_URL}/api/upload/lesson/audio`;
      } else if (mediaType === "text") {
        endpoint = `${UPLOAD_URL}/api/upload/lesson/text`;
      } else {
        endpoint = `${UPLOAD_URL}/api/upload/lesson/images`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      if (result.success) {
        const uploadedData = Array.isArray(result.data)
          ? result.data[0]
          : result.data;
        return uploadedData.url;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      console.error("Error uploading file:", err);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const createMedia = async (
    lessonId: number,
    data: {
      order_index: number;
      description: string;
      media_type: string;
      media_url: string;
      transcription: string;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-medias/${lessonId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        await fetchMediasByLessonId(lessonId);
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create media");
      console.error("Error creating media:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMedia = async (
    mediaId: number,
    data: {
      order_index: number;
      description: string;
      media_type: string;
      media_url: string;
      transcription: string;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-medias/${mediaId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh the medias list
        const currentMedia = medias.find((m) => m.media_id === mediaId);
        if (currentMedia) {
          await fetchMediasByLessonId(currentMedia.lesson_id);
        }
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update media");
      console.error("Error updating media:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaId: number): Promise<boolean> => {
    if (!confirm("Bạn có chắc chắn muốn xóa media này?")) {
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-medias/${mediaId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh the medias list
        const currentMedia = medias.find((m) => m.media_id === mediaId);
        if (currentMedia) {
          await fetchMediasByLessonId(currentMedia.lesson_id);
        }
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete media");
      console.error("Error deleting media:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LessonMediaContext.Provider
      value={{
        medias,
        loading,
        error,
        uploadingFile,
        fetchMediasByLessonId,
        createMedia,
        updateMedia,
        deleteMedia,
        uploadFile,
      }}
    >
      {children}
    </LessonMediaContext.Provider>
  );
};
