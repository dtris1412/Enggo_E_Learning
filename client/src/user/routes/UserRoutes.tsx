import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";

// Import user pages here
// import UserProfile from '../pages/Profile';
// import MyCourses from '../pages/MyCourses';
// import MyExams from '../pages/MyExams';

export const UserRoutes = () => {
  return (
    <>
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
