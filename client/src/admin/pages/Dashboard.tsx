import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useDashboard } from "../contexts/dashboardContext";
import {
  StatCard,
  RecentSubscriptionsList,
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
        <p className="text-gray-600">Tổng quan hệ thống EnglishMaster</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Row 1: Featured Banner + Stats Grid (3 cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Featured Banner - takes 1/3 */}
        <div className="lg:col-span-1">
          <FeaturedBanner />
        </div>

        {/* Stats Grid - takes 2/3 with 3 columns inside */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            {stats.slice(0, 3).map((stat, index) => (
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
        </div>
      </div>

      {/* Row 2: Recent Exams (2/4) + Test Chart Donut (1/4) + Top Blogs (1/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Recent Completed Exams - takes 2/4 (half) */}
        <div className="lg:col-span-2">
          <RecentCompletedExams
            exams={recentCompletedExams}
            loading={loading}
          />
        </div>

        {/* Test Completion Chart - takes 1/4 */}
        <div className="lg:col-span-1">
          <TestCompletionChart
            totalAttempts={totalTestAttempts}
            completedTests={completedTests}
            completionRate={completionRate}
          />
        </div>

        {/* Top Blogs - takes 1/4 */}
        <div className="lg:col-span-1">
          <TopBlogs blogs={topBlogs} loading={loading} />
        </div>
      </div>

      {/* Row 3: Top Learned Flashcards (1/3) + Documents (1/3) + Subscriptions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TopLearnedFlashcards
          flashcards={topLearnedFlashcards}
          loading={loading}
        />
        <TopDocuments documents={topDocuments} loading={loading} />
        <RecentSubscriptionsList
          subscriptions={recentSubscriptions}
          loading={loading}
        />
      </div>

      {/* Row 4: 4th Stat Card + AI Quota System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatCard
          title={stats[3].title}
          value={stats[3].value}
          change={stats[3].change}
          changeType={stats[3].changeType}
          icon={stats[3].icon}
        />
        <SystemAIQuotaCard />
      </div>

      {/* Row 5: Top Courses (1/2) + Top Roadmaps (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCourses courses={topCourses} loading={loading} />
        <TopRoadmaps roadmaps={topRoadmaps} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
