import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface LessonMedia {
  media_id: number;
  order_index: number;
  description: string | null;
  media_type: string;
  media_url: string;
  transcript: string | null;
}

interface LessonQuestion {
  lesson_question_id: number;
  order_index: number;
  question_type: string;
  content: string;
  options: Array<{ value: string; label: string }> | null;
  correct_answer: string;
  explaination: string | null;
  difficulty_level: string;
}

interface Lesson {
  lesson_id: number;
  lesson_type: string;
  lesson_title: string;
  lesson_content: string;
  estimated_time: number;
  difficulty_level: string;
  is_exam_format: boolean;
  Lesson_Media?: LessonMedia[];
  Lesson_Questions?: LessonQuestion[];
}

interface ModuleLesson {
  module_lesson_id: number;
  description: string;
  order_index: number;
  status: boolean;
  Lesson: Lesson;
}

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
  Module_Lessons?: ModuleLesson[];
}

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  course_aim: string;
  estimate_duration: number;
  tag: string;
  access_type: "free" | "premium";
  Modules?: Module[];
}

interface LessonProgress {
  user_lesson_progress_id?: number;
  user_id?: number;
  lesson_id: number;
  started_at?: string | null;
  completed_at?: string | null;
  progress_percentage: number;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

interface LearningContextType {
  course: Course | null;
  currentLesson: Lesson | null;
  currentModuleLesson: ModuleLesson | null;
  lessonProgress: LessonProgress | null;
  loading: boolean;
  error: string | null;
  loadCourse: (courseId: number) => Promise<void>;
  selectLesson: (moduleLessonId: number) => Promise<void>;
  loadLessonDetail: (lessonId: number) => Promise<void>;
  updateProgress: (
    lessonId: number,
    progressPercentage: number,
    isCompleted?: boolean,
  ) => Promise<boolean>;
  getNextLesson: () => ModuleLesson | null;
  getPreviousLesson: () => ModuleLesson | null;
  markLessonComplete: () => Promise<void>;
}

const LearningContext = createContext<LearningContextType | undefined>(
  undefined,
);

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};

export const LearningProvider = ({ children }: { children: ReactNode }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModuleLesson, setCurrentModuleLesson] =
    useState<ModuleLesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define loadLessonDetail first so it can be used in loadCourse
  const loadLessonDetail = useCallback(async (lessonId: number) => {
    try {
      console.log("🔍 Loading lesson detail for lesson_id:", lessonId);
      const response = await fetch(`${API_URL}/user/lessons/${lessonId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to load lesson details");
      }

      const result = await response.json();
      console.log("📦 Raw API response:", result);

      if (result.success && result.data) {
        // Transform lesson data
        const lessonData = result.data;

        console.log(
          "📊 Before transform - Lesson_Media:",
          lessonData.Lesson_Media,
        );
        console.log(
          "📊 Before transform - Lesson_Questions:",
          lessonData.Lesson_Questions,
        );

        // Transform Lesson_Questions options from JSON string to array format
        if (
          lessonData.Lesson_Questions &&
          Array.isArray(lessonData.Lesson_Questions)
        ) {
          lessonData.Lesson_Questions = lessonData.Lesson_Questions.map(
            (question: any) => {
              let transformedOptions = null;

              if (question.options) {
                try {
                  // Parse JSON string if it's a string
                  const optionsObj =
                    typeof question.options === "string"
                      ? JSON.parse(question.options)
                      : question.options;

                  // Transform object to array format: {A: "text", B: "text"} => [{value: "A", label: "text"}, ...]
                  if (typeof optionsObj === "object" && optionsObj !== null) {
                    transformedOptions = Object.entries(optionsObj).map(
                      ([key, value]) => ({
                        value: key,
                        label: value as string,
                      }),
                    );
                  }
                } catch (parseError) {
                  console.error(
                    "Failed to parse question options:",
                    parseError,
                  );
                }
              }

              return {
                ...question,
                options: transformedOptions,
              };
            },
          );
        }

        console.log(
          "✅ After transform - Lesson_Media count:",
          lessonData.Lesson_Media?.length || 0,
        );
        console.log(
          "✅ After transform - Lesson_Questions count:",
          lessonData.Lesson_Questions?.length || 0,
        );
        console.log("📋 Full transformed lesson data:", lessonData);

        // Update currentLesson with transformed data
        setCurrentLesson(lessonData);
        console.log("💾 Lesson saved to state");
      } else {
        throw new Error(result.message || "Failed to load lesson details");
      }
    } catch (err: any) {
      console.error("❌ Error loading lesson details:", err);
      setError(err.message);
    }
  }, []);

  const loadCourse = useCallback(
    async (courseId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/user/courses/${courseId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }

        const result = await response.json();
        if (result.success) {
          setCourse(result.data);

          // Auto-select first lesson
          if (result.data.Modules && result.data.Modules.length > 0) {
            const firstModule = result.data.Modules.sort(
              (a: Module, b: Module) => a.order_index - b.order_index,
            )[0];
            if (
              firstModule.Module_Lessons &&
              firstModule.Module_Lessons.length > 0
            ) {
              const firstLesson = firstModule.Module_Lessons.sort(
                (a: ModuleLesson, b: ModuleLesson) =>
                  a.order_index - b.order_index,
              )[0];
              setCurrentModuleLesson(firstLesson);
              setCurrentLesson(firstLesson.Lesson);

              // Load progress for first lesson
              await loadLessonProgress(firstLesson.Lesson.lesson_id);

              // Load full lesson details with media and questions
              console.log(
                "🔄 Auto-loading first lesson details for lesson_id:",
                firstLesson.Lesson.lesson_id,
              );
              await loadLessonDetail(firstLesson.Lesson.lesson_id);
            }
          }
        } else {
          // Handle when API returns success: false
          throw new Error(result.message || "Failed to load course");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch course");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadLessonDetail],
  );

  const loadLessonProgress = async (lessonId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLessonProgress({
          lesson_id: lessonId,
          progress_percentage: 0,
          is_completed: false,
        });
        return;
      }

      const response = await fetch(
        `${API_URL}/user/lessons/${lessonId}/progress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lesson progress");
      }

      const result = await response.json();
      if (result.data.started && result.data.progress) {
        setLessonProgress(result.data.progress);
      } else {
        setLessonProgress({
          lesson_id: lessonId,
          progress_percentage: 0,
          is_completed: false,
        });
      }
    } catch (err: any) {
      console.error("Error fetching lesson progress:", err);
      setLessonProgress({
        lesson_id: lessonId,
        progress_percentage: 0,
        is_completed: false,
      });
    }
  };

  const selectLesson = useCallback(
    async (moduleLessonId: number) => {
      console.log(
        "🎯 selectLesson called with moduleLessonId:",
        moduleLessonId,
      );
      if (!course?.Modules) {
        console.log("⚠️ No course modules available");
        return;
      }

      for (const module of course.Modules) {
        if (!module.Module_Lessons) continue;

        const foundModuleLesson = module.Module_Lessons.find(
          (ml) => ml.module_lesson_id === moduleLessonId,
        );

        if (foundModuleLesson) {
          console.log(
            "✅ Found module lesson:",
            foundModuleLesson.Lesson.lesson_title,
          );
          setCurrentModuleLesson(foundModuleLesson);
          setCurrentLesson(foundModuleLesson.Lesson);
          console.log(
            "📊 Loading progress for lesson_id:",
            foundModuleLesson.Lesson.lesson_id,
          );
          loadLessonProgress(foundModuleLesson.Lesson.lesson_id);
          // Load full lesson details with media and questions
          console.log(
            "🔄 Calling loadLessonDetail for lesson_id:",
            foundModuleLesson.Lesson.lesson_id,
          );
          await loadLessonDetail(foundModuleLesson.Lesson.lesson_id);
          console.log("✅ selectLesson completed");
          break;
        }
      }
    },
    [course, loadLessonDetail],
  );

  const updateProgress = useCallback(
    async (
      lessonId: number,
      progressPercentage: number,
      isCompleted = false,
    ) => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("You must be logged in to update progress");
        }

        const response = await fetch(
          `${API_URL}/user/lessons/${lessonId}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ progressPercentage, isCompleted }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update lesson progress");
        }

        const result = await response.json();
        if (result.success) {
          // Reload progress
          await loadLessonProgress(lessonId);
        }
        return result.success;
      } catch (err: any) {
        console.error("Error updating lesson progress:", err);
        return false;
      }
    },
    [],
  );

  const getAllLessons = useCallback((): ModuleLesson[] => {
    if (!course?.Modules) return [];

    const allLessons: ModuleLesson[] = [];
    course.Modules.sort((a, b) => a.order_index - b.order_index).forEach(
      (module) => {
        if (module.Module_Lessons) {
          const sortedLessons = [...module.Module_Lessons].sort(
            (a, b) => a.order_index - b.order_index,
          );
          allLessons.push(...sortedLessons);
        }
      },
    );

    return allLessons;
  }, [course]);

  const getNextLesson = useCallback((): ModuleLesson | null => {
    if (!currentModuleLesson) return null;

    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(
      (ml) => ml.module_lesson_id === currentModuleLesson.module_lesson_id,
    );

    if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
      return null;
    }

    return allLessons[currentIndex + 1];
  }, [currentModuleLesson, getAllLessons]);

  const getPreviousLesson = useCallback((): ModuleLesson | null => {
    if (!currentModuleLesson) return null;

    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(
      (ml) => ml.module_lesson_id === currentModuleLesson.module_lesson_id,
    );

    if (currentIndex <= 0) {
      return null;
    }

    return allLessons[currentIndex - 1];
  }, [currentModuleLesson, getAllLessons]);

  const markLessonComplete = useCallback(async () => {
    if (!currentLesson) return;

    await updateProgress(currentLesson.lesson_id, 100, true);

    // Auto-navigate to next lesson
    const nextLesson = getNextLesson();
    if (nextLesson) {
      selectLesson(nextLesson.module_lesson_id);
    }
  }, [currentLesson, updateProgress, getNextLesson, selectLesson]);

  return (
    <LearningContext.Provider
      value={{
        course,
        currentLesson,
        currentModuleLesson,
        lessonProgress,
        loading,
        error,
        loadCourse,
        selectLesson,
        loadLessonDetail,
        updateProgress,
        getNextLesson,
        getPreviousLesson,
        markLessonComplete,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
