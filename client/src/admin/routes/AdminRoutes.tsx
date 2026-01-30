import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import AdminLayout from "../components/AdminLayout.tsx";

// Import admin pages
import Dashboard from "../pages/Dashboard";
import AccountManagement from "../pages/AccountManagement";
import CourseManagement from "../pages/CourseManagement";
import CourseDetail from "../pages/CourseDetail";
import LessonManagement from "../pages/LessonManagement";
import LessonDetail from "../pages/LessonDetail";
import QuestionManagement from "../pages/QuestionManagement";
import TestManagement from "../pages/TestManagement";
import NewsManagement from "../pages/NewsManagement";
import BlogDetail from "../pages/BlogDetail";
import FeedbackManagement from "../pages/FeedbackManagement";
import ReportManagement from "../pages/ReportManagement";
import CertificateManagement from "../pages/CertificateManagement";
import RoadmapManagement from "../pages/RoadmapManagement";
import RoadmapDetail from "../pages/RoadmapDetail";
import SkillManagement from "../pages/SkillManagement";
import DocumentManagement from "../pages/DocumentManagement";

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

        {/* Course Management Group */}
        <Route path="courses" element={<CourseManagement />} />
        <Route path="courses/:course_id" element={<CourseDetail />} />
        <Route path="lessons" element={<LessonManagement />} />
        <Route path="lessons/:lesson_id" element={<LessonDetail />} />
        <Route path="questions" element={<QuestionManagement />} />

        {/* Test Management */}
        <Route path="tests" element={<TestManagement />} />

        {/* News/Blog Management */}
        <Route path="news" element={<NewsManagement />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />

        {/* Feedback Management */}
        <Route path="feedback" element={<FeedbackManagement />} />

        {/* Report Management */}
        <Route path="reports" element={<ReportManagement />} />

        {/* Certificate & Roadmap Management */}
        <Route path="certificates" element={<CertificateManagement />} />
        <Route path="roadmaps" element={<RoadmapManagement />} />
        <Route path="roadmaps/:roadmap_id" element={<RoadmapDetail />} />

        {/* Skill Management */}
        <Route path="skills" element={<SkillManagement />} />

        {/* Document Management */}
        <Route path="documents" element={<DocumentManagement />} />
      </Route>
    </>
  );
};
