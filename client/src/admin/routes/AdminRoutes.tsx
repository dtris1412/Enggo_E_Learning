import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import AdminLayout from "../components/AdminLayout.tsx";

// Import admin pages
import Dashboard from "../pages/Dashboard";
import AccountManagement from "../pages/AccountManagement";
import CourseManagement from "../pages/CourseManagement";
import LessonManagement from "../pages/LessonManagement";
import TestManagement from "../pages/TestManagement";
import NewsManagement from "../pages/NewsManagement";
import FeedbackManagement from "../pages/FeedbackManagement";
import ReportManagement from "../pages/ReportManagement";
import ProgressTracking from "../pages/ProgressTracking";
import RoadmapManagement from "../pages/RoadmapManagement";

export const AdminRoutes = () => {
  return (
    <>
      {/* Admin Dashboard - Requires admin role (role = 1) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={1}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Account Management */}
        <Route path="accounts" element={<AccountManagement />} />

        {/* Course Management */}
        <Route path="courses" element={<CourseManagement />} />

        {/* Lesson Management */}
        <Route path="lessons" element={<LessonManagement />} />

        {/* Test Management */}
        <Route path="tests" element={<TestManagement />} />

        {/* News/Blog Management */}
        <Route path="news" element={<NewsManagement />} />

        {/* Feedback Management */}
        <Route path="feedback" element={<FeedbackManagement />} />

        {/* Report Management */}
        <Route path="reports" element={<ReportManagement />} />

        {/* Progress Tracking */}
        <Route path="progress" element={<ProgressTracking />} />

        {/* Roadmap Management */}
        <Route path="roadmap" element={<RoadmapManagement />} />
      </Route>
    </>
  );
};
