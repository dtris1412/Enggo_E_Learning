import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRoadmap } from "../../contexts/roadmapContext";
import {
  Clock,
  BookOpen,
  Target,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Award,
  Map,
  Lock,
  PlayCircle,
  FileText,
  File,
  Download,
  Rocket,
} from "lucide-react";

const RoadmapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoadmapById, loading, startRoadmap, getRoadmapProgress } =
    useRoadmap();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const [roadmapProgress, setRoadmapProgress] = useState<{
    started: boolean;
    progress: any;
  } | null>(null);
  const [startingRoadmap, setStartingRoadmap] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!id) return;
      const roadmapData = await getRoadmapById(Number(id));
      if (roadmapData) {
        setRoadmap(roadmapData);
        // Expand first phase by default
        if (roadmapData.Phases && roadmapData.Phases.length > 0) {
          setExpandedPhases([roadmapData.Phases[0].phase_id]);
        }

        // Fetch progress
        const progress = await getRoadmapProgress(Number(id));
        setRoadmapProgress(progress);
      } else {
        navigate("/roadmaps");
      }
    };

    fetchRoadmap();
  }, [id, getRoadmapById, getRoadmapProgress, navigate]);

  const handleStartRoadmap = async () => {
    if (!id) return;
    setStartingRoadmap(true);
    const success = await startRoadmap(Number(id));
    if (success) {
      const progress = await getRoadmapProgress(Number(id));
      setRoadmapProgress(progress);
    }
    setStartingRoadmap(false);
  };

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId],
    );
  };

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-red-500" />;
      case "reading":
      case "text":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-500" />;
    }
  };

  const totalCourses =
    roadmap?.Phases?.reduce(
      (acc: number, phase: any) => acc + (phase.Phase_Courses?.length || 0),
      0,
    ) || 0;

  const totalDocuments =
    roadmap?.Phases?.reduce(
      (acc: number, phase: any) => acc + (phase.Document_Phases?.length || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải lộ trình...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/roadmaps")}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách lộ trình
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Map className="h-8 w-8" />
                <span
                  className={`${getLevelColor(roadmap.roadmap_level)} text-sm px-3 py-1 rounded-full font-medium border`}
                >
                  {roadmap.roadmap_level}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {roadmap.roadmap_title}
              </h1>

              <p className="text-xl text-blue-100 mb-6">
                {roadmap.roadmap_description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>
                    {roadmap.estimated_duration} ngày (~
                    {Math.round(roadmap.estimated_duration / 7)} tuần)
                  </span>
                </div>
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  <span>{roadmap.Phases?.length || 0} phases</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{totalCourses} khóa học</span>
                </div>
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2" />
                  <span>{totalDocuments} tài liệu</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-lg font-semibold">Chứng chỉ</h3>
                </div>
                {roadmap.Certificate && (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">
                      {roadmap.Certificate.certificate_name}
                    </p>
                    <p className="text-blue-100">
                      {roadmap.Certificate.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Mục tiêu lộ trình
              </h2>
              <p className="text-slate-700 mb-6">{roadmap.roadmap_aim}</p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Lộ trình chi tiết
              </h2>

              {roadmap.Phases && roadmap.Phases.length > 0 ? (
                <div className="space-y-6">
                  {roadmap.Phases.sort(
                    (a: any, b: any) => a.order - b.order,
                  ).map((phase: any, phaseIndex: number) => (
                    <div
                      key={phase.phase_id}
                      className="border-2 border-slate-200 rounded-lg overflow-hidden"
                    >
                      {/* Phase Header */}
                      <button
                        onClick={() => togglePhase(phase.phase_id)}
                        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left flex-1">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-md">
                            {phaseIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg">
                              {phase.phase_name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {phase.Phase_Courses?.length || 0} khóa học •{" "}
                              {phase.Document_Phases?.length || 0} tài liệu
                            </p>
                          </div>
                        </div>
                        {expandedPhases.includes(phase.phase_id) ? (
                          <ChevronUp className="h-6 w-6 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-slate-500" />
                        )}
                      </button>

                      {/* Phase Content */}
                      {expandedPhases.includes(phase.phase_id) && (
                        <div className="p-5 bg-white">
                          <p className="text-slate-700 mb-4">
                            {phase.phase_description}
                          </p>
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Mục tiêu:
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              {phase.phase_aims}
                            </p>
                          </div>

                          {/* Courses in Phase */}
                          {phase.Phase_Courses &&
                            phase.Phase_Courses.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                  Khóa học
                                </h4>
                                <div className="space-y-3">
                                  {phase.Phase_Courses.sort(
                                    (a: any, b: any) =>
                                      a.order_number - b.order_number,
                                  ).map((phaseCourse: any) => (
                                    <div
                                      key={phaseCourse.phase_course_id}
                                      className="border border-slate-200 rounded-lg overflow-hidden"
                                    >
                                      <div
                                        onClick={() =>
                                          toggleCourse(
                                            phaseCourse.Course.course_id,
                                          )
                                        }
                                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                                      >
                                        <div className="flex items-center gap-3 flex-1">
                                          <span className="text-sm font-semibold text-blue-600">
                                            #{phaseCourse.order_number}
                                          </span>
                                          <div className="flex-1">
                                            <h5 className="font-semibold text-slate-900">
                                              {phaseCourse.Course.course_title}
                                            </h5>
                                            <div className="flex items-center gap-3 mt-1">
                                              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                                {
                                                  phaseCourse.Course
                                                    .course_level
                                                }
                                              </span>
                                              <span className="text-xs text-slate-500">
                                                {
                                                  phaseCourse.Course
                                                    .estimate_duration
                                                }{" "}
                                                giờ
                                              </span>
                                              {phaseCourse.is_required && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                                  Bắt buộc
                                                </span>
                                              )}
                                              {phaseCourse.Course
                                                .access_type === "premium" && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                  <Lock className="h-3 w-3" />
                                                  Premium
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {expandedCourses.includes(
                                          phaseCourse.Course.course_id,
                                        ) ? (
                                          <ChevronUp className="h-5 w-5 text-slate-500" />
                                        ) : (
                                          <ChevronDown className="h-5 w-5 text-slate-500" />
                                        )}
                                      </div>

                                      {/* Course Modules */}
                                      {expandedCourses.includes(
                                        phaseCourse.Course.course_id,
                                      ) && (
                                        <div className="p-4 bg-white border-t border-slate-200">
                                          <p className="text-sm text-slate-600 mb-3">
                                            {phaseCourse.Course.description}
                                          </p>

                                          {phaseCourse.Course.Modules &&
                                            phaseCourse.Course.Modules.length >
                                              0 && (
                                              <div className="space-y-2">
                                                <p className="text-sm font-semibold text-slate-700">
                                                  Modules (
                                                  {
                                                    phaseCourse.Course.Modules
                                                      .length
                                                  }
                                                  ):
                                                </p>
                                                {phaseCourse.Course.Modules.map(
                                                  (module: any) => (
                                                    <div
                                                      key={module.module_id}
                                                      className="bg-slate-50 rounded p-3"
                                                    >
                                                      <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-slate-800">
                                                          {module.module_title}
                                                        </p>
                                                        <span className="text-xs text-slate-500">
                                                          {
                                                            module.estimated_time
                                                          }{" "}
                                                          phút
                                                        </span>
                                                      </div>

                                                      {/* Lessons */}
                                                      {module.Module_Lessons &&
                                                        module.Module_Lessons
                                                          .length > 0 && (
                                                          <div className="space-y-1 mt-2 ml-4">
                                                            {module.Module_Lessons.map(
                                                              (ml: any) => (
                                                                <div
                                                                  key={
                                                                    ml.module_lesson_id
                                                                  }
                                                                  className="flex items-center gap-2 text-xs text-slate-600"
                                                                >
                                                                  {getLessonIcon(
                                                                    ml.Lesson
                                                                      .lesson_type,
                                                                  )}
                                                                  <span>
                                                                    {
                                                                      ml.Lesson
                                                                        .lesson_title
                                                                    }
                                                                  </span>
                                                                  <span className="text-slate-400">
                                                                    (
                                                                    {
                                                                      ml.Lesson
                                                                        .estimated_time
                                                                    }{" "}
                                                                    phút)
                                                                  </span>
                                                                </div>
                                                              ),
                                                            )}
                                                          </div>
                                                        )}
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            )}

                                          <Link
                                            to={`/courses/${phaseCourse.Course.course_id}`}
                                            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                          >
                                            Xem chi tiết khóa học →
                                          </Link>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Documents in Phase */}
                          {phase.Document_Phases &&
                            phase.Document_Phases.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <File className="h-5 w-5 text-green-600" />
                                  Tài liệu
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {phase.Document_Phases.sort(
                                    (a: any, b: any) =>
                                      a.order_index - b.order_index,
                                  ).map((docPhase: any) => (
                                    <Link
                                      key={docPhase.document_phase_id}
                                      to={`/documents/${docPhase.Document.document_id}`}
                                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                      <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">
                                          {docPhase.Document.document_name}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                          {docPhase.Document.document_type} •{" "}
                                          {docPhase.Document.file_type}
                                        </p>
                                      </div>
                                      {docPhase.Document.access_type ===
                                        "premium" && (
                                        <Lock className="h-4 w-4 text-yellow-600" />
                                      )}
                                      <Download className="h-4 w-4 text-slate-400" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Chưa có nội dung lộ trình
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Thông tin lộ trình
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Phases</span>
                  <span className="font-semibold text-slate-900">
                    {roadmap.Phases?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tổng khóa học</span>
                  <span className="font-semibold text-slate-900">
                    {totalCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tài liệu</span>
                  <span className="font-semibold text-slate-900">
                    {totalDocuments}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Thời lượng dự kiến</span>
                  <span className="font-semibold text-slate-900">
                    {roadmap.estimated_duration} ngày
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Trình độ</span>
                  <span className="font-semibold text-slate-900">
                    {roadmap.roadmap_level}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              {roadmapProgress?.started && roadmapProgress.progress ? (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">
                      Tiến độ
                    </span>
                    <span className="text-sm font-bold text-blue-700">
                      {Math.round(roadmapProgress.progress.progress_percentage)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${roadmapProgress.progress.progress_percentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-blue-700">
                    {roadmapProgress.progress.completedCourses || 0} /{" "}
                    {roadmapProgress.progress.totalCourses || 0} khóa học hoàn
                    thành
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStartRoadmap}
                  disabled={startingRoadmap}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {startingRoadmap ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang bắt đầu...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5" />
                      <span>Bắt đầu lộ trình</span>
                    </>
                  )}
                </button>
              )}

              {/* Certificate Info */}
              {roadmap.Certificate && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900 mb-1">
                          Chứng chỉ hoàn thành
                        </p>
                        <p className="text-xs text-yellow-800">
                          {roadmap.Certificate.certificate_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
