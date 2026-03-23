import { useState, useCallback } from "react";

interface AnalysisResult {
  analysis_type: string;
  analysis: string;
}

interface UseAIAnalyzerReturn {
  analyzeExamPerformance: (examData: any) => Promise<AnalysisResult | null>;
  analyzeLearningPath: (learningData: any) => Promise<AnalysisResult | null>;
  analyzeWeaknesses: (performanceData: any) => Promise<AnalysisResult | null>;
  generatePracticeSet: (learningData: any) => Promise<AnalysisResult | null>;
  isAnalyzing: boolean;
  error: string | null;
}

export const useAIAnalyzer = (): UseAIAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = useCallback(
    async (analysisType: string, data: any): Promise<AnalysisResult | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");

        // Check if user is logged in
        if (!token) {
          setError("User not authenticated");
          console.warn("AI Analyzer: User not logged in");
          return null;
        }

        const response = await fetch("/api/user/ai/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            analysis_type: analysisType,
            data: data,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error("Failed to analyze data");
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        console.error("AI Analyzer error:", err);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  const analyzeExamPerformance = useCallback(
    async (examData: any) => {
      return analyzeData("exam_performance", examData);
    },
    [analyzeData],
  );

  const analyzeLearningPath = useCallback(
    async (learningData: any) => {
      return analyzeData("learning_path", learningData);
    },
    [analyzeData],
  );

  const analyzeWeaknesses = useCallback(
    async (performanceData: any) => {
      return analyzeData("weaknesses", performanceData);
    },
    [analyzeData],
  );

  const generatePracticeSet = useCallback(
    async (learningData: any) => {
      return analyzeData("practice_set", learningData);
    },
    [analyzeData],
  );

  return {
    analyzeExamPerformance,
    analyzeLearningPath,
    analyzeWeaknesses,
    generatePracticeSet,
    isAnalyzing,
    error,
  };
};

// Helper function để tự động phân tích sau khi hoàn thành exam
export const autoAnalyzeAfterExam = async (examResult: any) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("Auto-analysis skipped: User not logged in");
      return null;
    }

    const response = await fetch("/api/user/ai/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        analysis_type: "exam_performance",
        data: examResult,
      }),
    });

    if (response.ok) {
      const analysis = await response.json();
      console.log("Auto-analysis completed:", analysis);
      return analysis;
    } else if (response.status === 401) {
      localStorage.removeItem("accessToken");
      console.warn("Auto-analysis failed: Session expired");
    }
  } catch (error) {
    console.error("Auto-analysis failed:", error);
  }
  return null;
};

// Helper function để generate flashcard từ content
export const generateFlashcardFromContent = async (
  content: string,
  topic?: string,
) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("Generate flashcard failed: User not logged in");
      return null;
    }

    const response = await fetch("/api/user/ai/generate-flashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        topic,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to generate flashcard");
    }

    const result = await response.json();
    return result.flashcards;
  } catch (error) {
    console.error("Generate flashcard error:", error);
    return null;
  }
};
