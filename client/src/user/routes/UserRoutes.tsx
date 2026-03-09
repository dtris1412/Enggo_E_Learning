import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import PaymentCheckout from "../pages/PaymentCheckout";
import PaymentResult from "../pages/PaymentResult";

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
