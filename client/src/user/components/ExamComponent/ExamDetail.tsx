import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import {
  FileText,
  Clock,
  Calendar,
  ArrowLeft,
  Play,
  BookOpen,
  TrendingUp,
  Award,
  Volume2,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExamById, getUserExamHistory, startExam } = useExam();
  const { showToast } = useToast();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedContainers, setSelectedContainers] = useState<number[]>([]);
  const [isFullExam, setIsFullExam] = useState(true);
  const [startingExam, setStartingExam] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchExam = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const examData = await getExamById(parseInt(id));
        if (examData) {
          setExam(examData);
        } else {
          showToast("error", "Failed to load exam");
          setTimeout(() => navigate("/exams"), 2000);
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
        showToast("error", "Failed to load exam");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Fetch user's exam history (only if authenticated)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated || !id) return;

      try {
        const result = await getUserExamHistory(1, 5);
        if (result.success && result.data) {
          // Filter history for current exam
          const currentExamHistory = result.data.filter(
            (item: any) => item.exam_id === parseInt(id),
          );
          setHistory(currentExamHistory);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [isAuthenticated, id]);

  const handleStartExam = async () => {
    if (!isAuthenticated) {
      showToast("error", "Please login to take the exam");
      navigate("/login");
      return;
    }

    if (!isFullExam && selectedContainers.length === 0) {
      showToast("error", "Please select at least one part to take the exam");
      return;
    }

    setStartingExam(true);
    try {
      const selected_parts = isFullExam
        ? ["all"]
        : selectedContainers.map((id) => id.toString());

      const result = await startExam(parseInt(id!), selected_parts);

      if (result.success) {
        // Navigate to exam taking page with the user_exam_id
        navigate(`/exams/${id}/take`, {
          state: { userExamId: result.data.user_exam_id },
        });
      } else {
        showToast("error", result.message || "Failed to start exam");
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      showToast("error", "Failed to start exam");
    } finally {
      setStartingExam(false);
    }
  };

  const toggleFullExam = () => {
    setIsFullExam(!isFullExam);
    if (!isFullExam) {
      setSelectedContainers([]);
    }
  };

  const toggleContainer = (containerId: number) => {
    if (isFullExam) return;

    setSelectedContainers((prev) => {
      if (prev.includes(containerId)) {
        return prev.filter((id) => id !== containerId);
      } else {
        return [...prev, containerId];
      }
    });
  };

  const groupContainersBySkill = () => {
    if (!exam?.Exam_Containers) return {};

    // Only show parent containers (parent_id is null or undefined)
    const parentContainers = exam.Exam_Containers.filter(
      (container: any) =>
        container.parent_id === null || container.parent_id === undefined,
    );

    const grouped: Record<string, any[]> = {};
    parentContainers.forEach((container: any) => {
      const skill = container.skill || "General";
      if (!grouped[skill]) {
        grouped[skill] = [];
      }
      grouped[skill].push(container);
    });
    return grouped;
  };

  // Count questions including children containers
  const getContainerQuestionCount = (container: any): number => {
    let count = container.Container_Questions?.length || 0;

    // Add questions from children
    if (container.children && container.children.length > 0) {
      container.children.forEach((child: any) => {
        count += child.Container_Questions?.length || 0;
      });
    }

    return count;
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      Listening: "bg-blue-50 border-blue-200 text-blue-700",
      Reading: "bg-green-50 border-green-200 text-green-700",
      Writing: "bg-purple-50 border-purple-200 text-purple-700",
      Speaking: "bg-orange-50 border-orange-200 text-orange-700",
    };
    return colors[skill] || "bg-gray-50 border-gray-200 text-gray-700";
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "TOEIC":
        return "bg-blue-100 text-blue-800";
      case "IELTS":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Exam not found
          </h3>
          <button
            onClick={() => navigate("/exams")}
            className="text-blue-600 hover:underline"
          >
            Back to exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/exams")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Exams
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getExamTypeColor(
                    exam.exam_type,
                  )}`}
                >
                  {exam.exam_type}
                </span>
                <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  {exam.year}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {exam.exam_code}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {exam.exam_title}
              </h1>
              {exam.Certificate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">
                    {exam.Certificate.certificate_name}
                  </span>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={handleStartExam}
                disabled={
                  startingExam ||
                  (!isFullExam && selectedContainers.length === 0)
                }
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {startingExam ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    {isFullExam
                      ? "Start Full Exam"
                      : `Start Selected Parts (${selectedContainers.length})`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Exam Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {formatDuration(exam.exam_duration)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="font-semibold text-gray-900">
                      {exam.total_questions} questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold text-gray-900">{exam.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Award className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900">
                      {exam.exam_type}
                    </p>
                  </div>
                </div>
              </div>

              {exam.source && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Source</p>
                  <p className="font-medium text-gray-900">{exam.source}</p>
                </div>
              )}

              {exam.Exam_Medias && exam.Exam_Medias.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Audio Materials
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {exam.Exam_Medias.map((media: any) => (
                      <div
                        key={media.media_id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          Duration: {Math.floor(media.duration / 60)} minutes
                        </span>
                        <span className="text-xs text-gray-500">
                          Audio included
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Exam Parts Selection */}
            {exam.Exam_Containers && exam.Exam_Containers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Select Exam Parts
                </h2>

                {/* Full Exam Toggle */}
                <div
                  onClick={toggleFullExam}
                  className={`cursor-pointer p-4 rounded-lg border-2 mb-4 transition-all ${
                    isFullExam
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isFullExam ? (
                      <CheckSquare className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Full Exam (All Parts)
                      </h3>
                      <p className="text-sm text-gray-600">
                        Take the complete exam with all{" "}
                        {exam.Exam_Containers.length} parts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Parts */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    Or select specific parts:
                  </p>

                  {Object.entries(groupContainersBySkill()).map(
                    ([skill, containers]: [string, any[]]) => (
                      <div key={skill} className="space-y-2">
                        <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                          {skill}
                        </h4>
                        {containers.map((container: any) => (
                          <div
                            key={container.container_id}
                            onClick={() =>
                              toggleContainer(container.container_id)
                            }
                            className={`cursor-pointer p-3 rounded-lg border transition-all ${
                              isFullExam
                                ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                                : selectedContainers.includes(
                                      container.container_id,
                                    )
                                  ? `border-2 ${getSkillColor(skill)}`
                                  : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!isFullExam &&
                                (selectedContainers.includes(
                                  container.container_id,
                                ) ? (
                                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                ))}
                              {isFullExam && (
                                <CheckSquare className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    Part {container.order}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getSkillColor(
                                      skill,
                                    )}`}
                                  >
                                    {skill}
                                  </span>
                                </div>
                                {container.instruction && (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {container.instruction}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {getContainerQuestionCount(container)}{" "}
                                  questions
                                  {container.time_limit &&
                                    ` • ${container.time_limit} minutes`}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  )}
                </div>

                {/* Summary */}
                {!isFullExam && selectedContainers.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Selected:</span>{" "}
                      {selectedContainers.length} part(s) •{" "}
                      {exam.Exam_Containers.filter(
                        (c: any) =>
                          selectedContainers.includes(c.container_id) &&
                          (c.parent_id === null || c.parent_id === undefined),
                      ).reduce(
                        (sum: number, c: any) =>
                          sum + getContainerQuestionCount(c),
                        0,
                      )}{" "}
                      questions
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Instructions
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>
                    Make sure you have a stable internet connection before
                    starting the exam.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>
                    You will have {formatDuration(exam.exam_duration)} to
                    complete the exam.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>
                    Your answers will be automatically saved as you progress.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>
                    You can review and change your answers before submitting.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span>
                    Once submitted, you will receive your results immediately.
                  </span>
                </p>
              </div>
            </div>

            {/* Start Button (Mobile) */}
            <div className="lg:hidden">
              <button
                onClick={handleStartExam}
                disabled={
                  startingExam ||
                  (!isFullExam && selectedContainers.length === 0)
                }
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {startingExam ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    {isFullExam
                      ? "Start Full Exam"
                      : `Start Selected Parts (${selectedContainers.length})`}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* My Attempts */}
              {isAuthenticated && history.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">My Attempts</h3>
                  </div>
                  <div className="space-y-3">
                    {history.slice(0, 3).map((attempt: any) => (
                      <div
                        key={attempt.user_exam_id}
                        onClick={() =>
                          navigate(`/exams/result/${attempt.user_exam_id}`)
                        }
                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-500">
                            {new Date(
                              attempt.submitted_at,
                            ).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              attempt.status === "graded"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {attempt.status}
                          </span>
                        </div>
                        {attempt.total_score !== null && (
                          <p className="text-lg font-bold text-blue-600">
                            Score: {attempt.total_score}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/exams/history")}
                    className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    View All Attempts
                  </button>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900">Exam Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Find a quiet place to take the exam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Use headphones for listening sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Read all questions carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Manage your time wisely</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
