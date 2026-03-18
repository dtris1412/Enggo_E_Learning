import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import PaymentCheckout from "../pages/PaymentCheckout";
import PaymentResult from "../pages/PaymentResult";

// Exam Components
import Exam from "../pages/Exam";
import ExamDetail from "../components/ExamComponent/ExamDetail";
import ExamTaking from "../components/ExamComponent/ExamTaking";
import ExamResult from "../components/ExamComponent/ExamResult";
import ExamHistory from "../components/ExamComponent/ExamHistory";

// Import user pages here
// import UserProfile from '../pages/Profile';
// import MyCourses from '../pages/MyCourses';
// import MyExams from '../pages/MyExams';

export const UserRoutes = () => {
  return (
    <>
      {/* Payment Checkout - Requires authentication */}
      <Route
        path="/payment/checkout"
        element={
          <ProtectedRoute>
            <PaymentCheckout />
          </ProtectedRoute>
        }
      />

      {/* Payment Result - Public route */}
      <Route path="/payment/result" element={<PaymentResult />} />

      {/* Exam Routes */}
      {/* Exam List - Public */}
      <Route path="/exams" element={<Exam />} />

      {/* Exam Detail - Public */}
      <Route path="/exams/:id" element={<ExamDetail />} />

      {/* Exam Taking - Requires authentication */}
      <Route
        path="/exams/:id/take"
        element={
          <ProtectedRoute>
            <ExamTaking />
          </ProtectedRoute>
        }
      />

      {/* Exam Result - Requires authentication */}
      <Route
        path="/exams/result/:userExamId"
        element={
          <ProtectedRoute>
            <ExamResult />
          </ProtectedRoute>
        }
      />

      {/* Exam History - Requires authentication */}
      <Route
        path="/exams/history"
        element={
          <ProtectedRoute>
            <ExamHistory />
          </ProtectedRoute>
        }
      />

      {/* User Profile - Requires authentication */}
      {/* <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      /> */}

      {/* My Courses */}
      {/* <Route 
        path="/my-courses" 
        element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        } 
      /> */}

      {/* My Exams */}
      {/* <Route 
        path="/my-exams" 
        element={
          <ProtectedRoute>
            <MyExams />
          </ProtectedRoute>
        } 
      /> */}
    </>
  );
};
