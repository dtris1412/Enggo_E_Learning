import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useDashboard } from "../contexts/dashboardContext";
import {
  StatCard,
  RecentSubscriptionsList,
  RecentNewUsers,
  TestCompletionChart,
  SystemAIQuotaCard,
  RecentCompletedExams,
  TopDocuments,
  TopBlogs,
  FeaturedBanner,
  TopRoadmaps,
  TopLearnedFlashcards,
  TopCourses,
} from "../components/Dashboard";

const Dashboard = () => {
  const { dashboardData, loading, error, fetchDashboardStatistics } =
    useDashboard();

  useEffect(() => {
    fetchDashboardStatistics();
  }, []);

  // Debug: Log dashboard data
  useEffect(() => {
    if (dashboardData) {
      console.log("Dashboard Data fetched:", dashboardData);
      console.log("Recent Completed Exams:", dashboardData.recentCompletedExams);
    }
  }, [dashboardData]);

  const stats = [
    {
      title: "Tổng người dùng",
      value: loading
        ? "..."
        : dashboardData?.totalUsers.toLocaleString("vi-VN") || "0",
      change: "+12%",
      changeType: "increase" as const,
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Khóa học hoạt động",
      value: loading ? "..." : dashboardData?.activeCourses.toString() || "0",
      change: "+3",
      changeType: "increase" as const,
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Bài thi đã hoàn thành",
      value: loading
        ? "..."
        : dashboardData?.testStatistics.completedTests.toLocaleString(
            "vi-VN",
          ) || "0",
      change: "+8%",
      changeType: "increase" as const,
      icon: <FileText className="h-6 w-6 text-purple-600" />,
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: loading
        ? "..."
        : `${dashboardData?.testStatistics.completionRate || 0}%`,
      change: "+2%",
      changeType: "increase" as const,
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
    },
  ];

  const totalTestAttempts = dashboardData?.testStatistics.totalAttempts || 0;
  const completedTests = dashboardData?.testStatistics.completedTests || 0;
  const completionRate = dashboardData?.testStatistics.completionRate || 0;
  const recentSubscriptions = dashboardData?.recentSubscriptions || [];
  const recentCompletedExams = dashboardData?.recentCompletedExams || [];
  const topDocuments = dashboardData?.topDocuments || [];
  const topBlogs = dashboardData?.topBlogs || [];
  const topCourses = dashboardData?.topCourses || [];
  const topRoadmaps = dashboardData?.topRoadmaps || [];
  const topLearnedFlashcards = dashboardData?.topLearnedFlashcards || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống Enggo E-Learning</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Row 2: System Overview - 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Row 3: Featured Banner
      <div className="mb-6">
        <FeaturedBanner />
      </div> */}

      {/* AI Quota System */}
      <div className="mb-6">
        <SystemAIQuotaCard />
      </div>

      {/* Section 1: Người dùng - New Users + Subscriptions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Người Dùng</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentNewUsers limit={5} />
          <RecentSubscriptionsList
            subscriptions={recentSubscriptions}
            loading={loading}
          />
        </div>
      </div>

      {/* Section 2: Thi cử - Recent Exams + Test Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thi Cử</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentCompletedExams
            exams={recentCompletedExams}
            loading={loading}
          />
          <TestCompletionChart
            totalAttempts={totalTestAttempts}
            completedTests={completedTests}
            completionRate={completionRate}
          />
        </div>
      </div>

      {/* Section 3: Học tập - Flashcards + Documents + Blogs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Học Tập & Tài Liệu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopLearnedFlashcards
            flashcards={topLearnedFlashcards}
            loading={loading}
          />
          <TopDocuments documents={topDocuments} loading={loading} />
          <TopBlogs blogs={topBlogs} loading={loading} />
        </div>
      </div>

      {/* Section 4: Nội dung - Courses + Roadmaps */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Nội Dung</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCourses courses={topCourses} loading={loading} />
          <TopRoadmaps roadmaps={topRoadmaps} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
