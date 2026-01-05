import { Route } from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";

// Import admin pages here
// import AdminDashboard from '../pages/Dashboard';
// import AdminUsers from '../pages/Users';
// import AdminCourses from '../pages/Courses';

export const AdminRoutes = () => {
  return (
    <>
      {/* Admin Dashboard - Requires admin role (role = 1) */}
      {/* <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole={1}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      /> */}

      {/* Admin Users Management */}
      {/* <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole={1}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      /> */}

      {/* Admin Courses Management */}
      {/* <Route 
        path="/admin/courses" 
        element={
          <ProtectedRoute requiredRole={1}>
            <AdminCourses />
          </ProtectedRoute>
        } 
      /> */}
    </>
  );
};
