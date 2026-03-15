import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/contexts/authContext";
import { ToastProvider } from "./shared/components/Toast/Toast";
import { UserProvider } from "./admin/contexts/userContext";
import { CertificateProvider } from "./admin/contexts/certificateContext";
import { CourseProvider } from "./admin/contexts/courseContext";
import { ModuleProvider } from "./admin/contexts/moduleContext";
import { ModuleLessonProvider } from "./admin/contexts/moduleLessonContext.tsx";
import { LessonProvider } from "./admin/contexts/lessonContext.tsx";
import { LessonMediaProvider } from "./admin/contexts/lessonMediaContext.tsx";
import { LessonQuestionProvider } from "./admin/contexts/lessonQuestionContext.tsx";
import { SkillProvider } from "./admin/contexts/skillContext.tsx";
import { RoadmapProvider } from "./admin/contexts/roadmapContext.tsx";
import { PhaseProvider } from "./admin/contexts/phaseContext.tsx";
import { PhaseCourseProvider } from "./admin/contexts/phaseCourseContext.tsx";
import { DocumentProvider } from "./admin/contexts/documentContext.tsx";
import { DocumentPhaseProvider } from "./admin/contexts/documentPhaseContext.tsx";
import { DocumentProvider as UserDocumentProvider } from "./user/contexts/documentContext.tsx";
import { CourseProvider as UserCourseProvider } from "./user/contexts/courseContext.tsx";
import { RoadmapProvider as UserRoadmapProvider } from "./user/contexts/roadmapContext.tsx";
import { SubscriptionProvider as UserSubscriptionProvider } from "./user/contexts/subscriptionContext.tsx";
import { PaymentProvider } from "./user/contexts/paymentContext.tsx";
import { BlogProvider } from "./admin/contexts/blogContext.tsx";
import { BlogProvider as UserBlogProvider } from "./user/contexts/blogContext.tsx";
import { FlashcardProvider as UserFlashcardProvider } from "./user/contexts/flashcardContext.tsx";
import { ExamProvider } from "./admin/contexts/examContext.tsx";
import { ReportProvider } from "./admin/contexts/reportContext.tsx";
import { FlashcardProvider } from "./admin/contexts/flashcardContext.tsx";
import { SubscriptionProvider } from "./admin/contexts/subscriptionContext.tsx";
import { OrderPaymentProvider } from "./admin/contexts/orderPaymentContext.tsx";
import { UserSubscriptionTrackingProvider } from "./admin/contexts/userSubscriptionTrackingContext.tsx";
import { DashboardProvider } from "./admin/contexts/dashboardContext.tsx";
import { AdminRoutes } from "./admin/routes/AdminRoutes";
import { UserRoutes } from "./user/routes/UserRoutes";
import AuthCallback from "./shared/pages/AuthCallback";
import Header from "./user/components/Header.tsx";
import Footer from "./user/components/Footer.tsx";
import Home from "./user/pages/Home.tsx";
import About from "./user/pages/About.tsx";
import Courses from "./user/pages/Courses.tsx";
import CourseDetail from "./user/pages/CourseDetail.tsx";
import RoadmapDetail from "./user/pages/RoadmapDetail.tsx";
import LearningSpace from "./user/pages/LearningSpace.tsx";
import MyLearning from "./user/pages/MyLearning.tsx";
import Blog from "./user/pages/Blog.tsx";
import BlogDetail from "./user/pages/BlogDetail.tsx";
import BlogLayoutPage from "./user/pages/BlogLayoutPage.tsx";
import Document from "./user/pages/Document.tsx";
import DocumentDetail from "./user/components/DocumentComponent/DocumentDetail.tsx";
import Flashcard from "./user/pages/Flashcard.tsx";
import FlashcardCreate from "./user/pages/FlashcardCreate.tsx";
import FlashcardEdit from "./user/pages/FlashcardEdit.tsx";
import FlashcardDetailPage from "./user/pages/FlashcardDetail.tsx";
import FlashcardLearn from "./user/pages/FlashcardLearn.tsx";
import FlashcardLibrary from "./user/pages/FlashcardLibrary.tsx";
import FlashcardNotifications from "./user/pages/FlashcardNotifications.tsx";
import OnlineTests from "./user/pages/OnlineTests.tsx";
import Login from "./user/pages/Login.tsx";
import Register from "./user/pages/Register.tsx";
import ForgotPassword from "./user/pages/ForgotPassword.tsx";
import VerifyOTP from "./user/pages/VerifyOTP.tsx";
import ResetPassword from "./user/pages/ResetPassword.tsx";
import SubscriptionPlans from "./user/pages/SubscriptionPlans.tsx";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CertificateProvider>
          <CourseProvider>
            <ModuleProvider>
              <ModuleLessonProvider>
                <LessonProvider>
                  <LessonMediaProvider>
                    <LessonQuestionProvider>
                      <SkillProvider>
                        <RoadmapProvider>
                          <PhaseProvider>
                            <PhaseCourseProvider>
                              <DocumentProvider>
                                <DocumentPhaseProvider>
                                  <BlogProvider>
                                    <UserDocumentProvider>
                                      <UserCourseProvider>
                                        <UserRoadmapProvider>
                                          <UserSubscriptionProvider>
                                            <UserBlogProvider>
                                              <UserFlashcardProvider>
                                                <PaymentProvider>
                                                  <ExamProvider>
                                                    <ReportProvider>
                                                      <FlashcardProvider>
                                                        <SubscriptionProvider>
                                                          <OrderPaymentProvider>
                                                            <UserSubscriptionTrackingProvider>
                                                              <DashboardProvider>
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
                                                                                <Route
                                                                                  path="/"
                                                                                  element={
                                                                                    <Home />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/about"
                                                                                  element={
                                                                                    <About />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/courses"
                                                                                  element={
                                                                                    <Courses />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/courses/:id"
                                                                                  element={
                                                                                    <CourseDetail />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/roadmaps/:id"
                                                                                  element={
                                                                                    <RoadmapDetail />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/learning/:courseId"
                                                                                  element={
                                                                                    <LearningSpace />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/my-learning"
                                                                                  element={
                                                                                    <MyLearning />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/blog"
                                                                                  element={
                                                                                    <BlogLayoutPage />
                                                                                  }
                                                                                >
                                                                                  <Route
                                                                                    index
                                                                                    element={
                                                                                      <Blog />
                                                                                    }
                                                                                  />
                                                                                  <Route
                                                                                    path=":slug"
                                                                                    element={
                                                                                      <BlogDetail />
                                                                                    }
                                                                                  />
                                                                                </Route>
                                                                                <Route
                                                                                  path="/documents"
                                                                                  element={
                                                                                    <Document />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/documents/:id"
                                                                                  element={
                                                                                    <DocumentDetail />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards"
                                                                                  element={
                                                                                    <Flashcard />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/create"
                                                                                  element={
                                                                                    <FlashcardCreate />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/:flashcard_set_id/edit"
                                                                                  element={
                                                                                    <FlashcardEdit />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/:flashcard_set_id"
                                                                                  element={
                                                                                    <FlashcardDetailPage />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/:flashcard_set_id/learn"
                                                                                  element={
                                                                                    <FlashcardLearn />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/my-library"
                                                                                  element={
                                                                                    <FlashcardLibrary />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/flashcards/notifications"
                                                                                  element={
                                                                                    <FlashcardNotifications />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/tests"
                                                                                  element={
                                                                                    <OnlineTests />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/subscription"
                                                                                  element={
                                                                                    <SubscriptionPlans />
                                                                                  }
                                                                                />

                                                                                {/* Auth Routes */}
                                                                                <Route
                                                                                  path="/login"
                                                                                  element={
                                                                                    <Login />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/register"
                                                                                  element={
                                                                                    <Register />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/forgot-password"
                                                                                  element={
                                                                                    <ForgotPassword />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/verify-otp"
                                                                                  element={
                                                                                    <VerifyOTP />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/reset-password"
                                                                                  element={
                                                                                    <ResetPassword />
                                                                                  }
                                                                                />
                                                                                <Route
                                                                                  path="/auth/callback"
                                                                                  element={
                                                                                    <AuthCallback />
                                                                                  }
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
                                                              </DashboardProvider>
                                                            </UserSubscriptionTrackingProvider>
                                                          </OrderPaymentProvider>
                                                        </SubscriptionProvider>
                                                      </FlashcardProvider>
                                                    </ReportProvider>
                                                  </ExamProvider>
                                                </PaymentProvider>
                                              </UserFlashcardProvider>
                                            </UserBlogProvider>
                                          </UserSubscriptionProvider>
                                        </UserRoadmapProvider>
                                      </UserCourseProvider>
                                    </UserDocumentProvider>
                                  </BlogProvider>
                                </DocumentPhaseProvider>
                              </DocumentProvider>
                            </PhaseCourseProvider>
                          </PhaseProvider>
                        </RoadmapProvider>
                      </SkillProvider>
                    </LessonQuestionProvider>
                  </LessonMediaProvider>
                </LessonProvider>
              </ModuleLessonProvider>
            </ModuleProvider>
          </CourseProvider>
        </CertificateProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
