import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/contexts/authContext";
import { ToastProvider } from "./shared/components/Toast/Toast";
import { UserProvider } from "./admin/contexts/userContext";
import { CertificateProvider } from "./admin/contexts/certificateContext";
import { CourseProvider } from "./admin/contexts/courseContext";
import { LessonProvider } from "./admin/contexts/lessonContext.tsx";
import { PathwayProvider } from "./admin/contexts/pathwayContext.tsx";
import { AdminRoutes } from "./admin/routes/AdminRoutes";
import { UserRoutes } from "./user/routes/UserRoutes";
import AuthCallback from "./shared/pages/AuthCallback";
import Header from "./user/components/Header.tsx";
import Footer from "./user/components/Footer.tsx";
import Home from "./user/pages/Home.tsx";
import About from "./user/pages/About.tsx";
import Courses from "./user/pages/Courses.tsx";
import Resources from "./user/pages/Resources.tsx";
import Blog from "./user/pages/Blog.tsx";
import OnlineTests from "./user/pages/OnlineTests.tsx";
import Login from "./user/pages/Login.tsx";
import Register from "./user/pages/Register.tsx";
import ForgotPassword from "./user/pages/ForgotPassword.tsx";
import VerifyOTP from "./user/pages/VerifyOTP.tsx";
import ResetPassword from "./user/pages/ResetPassword.tsx";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CertificateProvider>
          <CourseProvider>
            <LessonProvider>
              <PathwayProvider>
                <ToastProvider>
                  <Router>
                    <Routes>
                      {/* Admin Routes - No Header/Footer */}
                      {AdminRoutes()}

                      {/* Public & User Routes - With Header/Footer */}
                      <Route
                        path="*"
                        element={
                          <div className="min-h-screen bg-white text-gray-900 flex flex-col">
                            <Header />
                            <main className="flex-grow">
                              <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/courses" element={<Courses />} />
                                <Route
                                  path="/resources"
                                  element={<Resources />}
                                />
                                <Route path="/blog" element={<Blog />} />
                                <Route
                                  path="/tests"
                                  element={<OnlineTests />}
                                />

                                {/* Auth Routes */}
                                <Route path="/login" element={<Login />} />
                                <Route
                                  path="/register"
                                  element={<Register />}
                                />
                                <Route
                                  path="/forgot-password"
                                  element={<ForgotPassword />}
                                />
                                <Route
                                  path="/verify-otp"
                                  element={<VerifyOTP />}
                                />
                                <Route
                                  path="/reset-password"
                                  element={<ResetPassword />}
                                />
                                <Route
                                  path="/auth/callback"
                                  element={<AuthCallback />}
                                />

                                {/* User Routes - Protected */}
                                {UserRoutes()}
                              </Routes>
                            </main>
                            <Footer />
                          </div>
                        }
                      />
                    </Routes>
                  </Router>
                </ToastProvider>
              </PathwayProvider>
            </LessonProvider>
          </CourseProvider>
        </CertificateProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
