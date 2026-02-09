import express, { Router } from "express";
import {
  requireAdmin,
  requireAuth,
  requireRole,
  requireUser,
  verifyToken,
} from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multerMiddleware.js";
// ===========User Controllers===========
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserStatusById,
  lockUser,
  unlockUser,
  getUsersPaginated,
  exportUsersToExcel,
} from "../controllers/userController.js";

// ===========Export Controllers===========
import {
  exportCoursesToExcel,
  exportLessonsToExcel,
  exportExamsToExcel,
  exportBlogsToExcel,
  exportDocumentsToExcel,
  exportRoadmapsToExcel,
} from "../controllers/exportController.js";

// ===========Certificate Controllers===========
import {
  createCertificate,
  updateCertificateById,
  lockCertificate,
  unlockCertificate,
  getCertificatesPaginated,
  getCertificateById,
} from "../controllers/certificateController.js";

// ===========Course Controllers===========
import {
  createCourse,
  updateCourseById,
  getCourseById,
  getCoursePaginated,
  lockCourseById,
  unlockCourseById,
} from "../controllers/courseController.js";

// ===========Module Controllers===========

import {
  createModule,
  updateModuleById,
  getModuleById,
  getModulesPaginated,
} from "../controllers/moduleController.js";

// ===========Skill Controllers===========
import {
  createSkill,
  updateSkill,
  getSkillsPaginated,
  getSkillById,
} from "../controllers/skillController.js";

// ===========Certificate-Skill Controllers===========
import {
  createCertificateSkill,
  updateCertificateSkill,
  getCertificateSkillsPaginated,
  getCertificateSkillById,
  deleteCertificateSkill,
} from "../controllers/certificateSkillController.js";

// ===========Lesson Controllers===========
import {
  createLesson,
  updateLessonById,
  getLessonById,
  getLessonsPaginated,
  lockLesson,
  unlockLesson,
} from "../controllers/lessonController.js";

// ===========Lesson Media Controllers===========
import {
  createMedia,
  updateMediaById,
  getMediasPaginated,
  getMediaById,
  getMediasByLessonId,
  deleteMedia,
} from "../controllers/lesson_mediaController.js";

// ===========Lesson Question Controllers===========
import {
  createQuestion,
  updateQuestion,
  getQuestionsByLessonIdPaginated,
  getQuestionsPaginated,
  getQuestionById,
  lockQuestion,
  unlockQuestion,
} from "../controllers/lesson_questionController.js";

// ===========Roadmap Controllers===========
import {
  getRoadmapsPaginated,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  lockRoadmap,
  unlockRoadmap,
} from "../controllers/roadmapController.js";

// ===========Phase Controllers===========
import {
  createPhase,
  updatePhase,
  getPhasesByRoadmapId,
  getPhaseById,
} from "../controllers/phaseController.js";

// ===========Phase Course Controllers===========
import {
  createPhaseCourse,
  updatePhaseCourse,
  getPhaseCoursesByPhaseId,
  removeCourseFromPhase,
} from "../controllers/phase_courseController.js";

// ===========Document Controllers===========
import {
  createDocument,
  updateDocument,
  getDocumentById,
  getDocumentsPaginated,
  deleteDocument,
} from "../controllers/documentController.js";

// ===========Document Phase Controllers===========
import {
  createDocumentPhase,
  updateDocumentPhase,
  deleteDocumentPhase,
  getDocumentPhases,
} from "../controllers/document_phaseController.js";

// ===========Module Lesson Controllers===========
import {
  createModuleLesson,
  updateModuleLesson,
  deleteModuleLesson,
  getModuleLessons,
} from "../controllers/module_lessonController.js";

// ===========Blog Controllers===========
import {
  getBlogsPaginated,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  getLatestBlogs,
  getPopularBlogs,
} from "../controllers/blogController.js";

// ===========Report Controllers===========
import {
  getReportsPaginated,
  getReportById,
  generateReport,
  downloadReport,
  deleteReport,
} from "../controllers/reportController.js";

// ===========Exam Controllers===========
import {
  createExam,
  getExamById,
  getExamsPaginated,
  updateExamById,
  deleteExamById,
  getExamWithDetails,
} from "../controllers/examController.js";

import {
  createExamContainer,
  updateExamContainer,
  deleteExamContainer,
  getContainersByExamId,
} from "../controllers/examContainerController.js";

import {
  createQuestion as createExamQuestion,
  updateQuestion as updateExamQuestion,
  deleteQuestion as deleteExamQuestion,
} from "../controllers/questionController.js";

import {
  addQuestionToContainer,
  removeQuestionFromContainer,
  updateQuestionOrderInContainer,
} from "../controllers/containerQuestionController.js";

import {
  createQuestionOption,
  updateQuestionOption,
  deleteQuestionOption,
} from "../controllers/questionOptionController.js";

import {
  createExamMedia,
  deleteExamMedia,
  getExamMediaByExamId,
} from "../controllers/examMediaController.js";

const router = express.Router();

const initAdminRoutes = (app) => {
  //===========User Management Routes===========
  router.get(
    "/api/admin/users/paginated",
    verifyToken,
    requireAdmin,
    getUsersPaginated,
  );
  router.get("/api/admin/users", verifyToken, requireAdmin, getAllUsers);

  router.get(
    "/api/admin/users/:user_id",
    verifyToken,
    requireAdmin,
    getUserById,
  );

  router.post("/api/admin/users", verifyToken, requireAdmin, createUser);
  router.put(
    "/api/admin/users/:user_id",
    verifyToken,
    requireAdmin,
    updateUserById,
  );
  router.patch(
    "/api/admin/users/:user_id/lock",
    verifyToken,
    requireAdmin,
    lockUser,
  );
  router.patch(
    "/api/admin/users/:user_id/unlock",
    verifyToken,
    requireAdmin,
    unlockUser,
  );
  // Quick Export
  router.get(
    "/api/admin/users/export",
    verifyToken,
    requireAdmin,
    exportUsersToExcel,
  );
  //   router.patch(
  //     "/api/admin/users/:user_id/user_status",
  //     verifyToken,
  //     requireAdmin,
  //     updateUserStatusById
  //   );

  //===========Certificate Management Routes===========
  router.get(
    "/api/admin/certificates/paginated",
    verifyToken,
    requireAdmin,
    getCertificatesPaginated,
  );
  router.get(
    "/api/admin/certificates/:certificate_id",
    verifyToken,
    requireAdmin,
    getCertificateById,
  );
  router.post(
    "/api/admin/certificates",
    verifyToken,
    requireAdmin,
    createCertificate,
  );
  router.put(
    "/api/admin/certificates/:certificate_id",
    verifyToken,
    requireAdmin,
    updateCertificateById,
  );
  router.patch(
    "/api/admin/certificates/:certificate_id/lock",
    verifyToken,
    requireAdmin,
    lockCertificate,
  );
  router.patch(
    "/api/admin/certificates/:certificate_id/unlock",
    verifyToken,
    requireAdmin,
    unlockCertificate,
  );

  //===========Course Management Routes===========
  router.get(
    "/api/admin/courses/paginated",
    verifyToken,
    requireAdmin,
    getCoursePaginated,
  );
  router.get(
    "/api/admin/courses/:course_id",
    verifyToken,
    requireAdmin,
    getCourseById,
  );
  router.post("/api/admin/courses", verifyToken, requireAdmin, createCourse);
  router.put(
    "/api/admin/courses/:course_id",
    verifyToken,
    requireAdmin,
    updateCourseById,
  );
  router.patch(
    "/api/admin/courses/:course_id/lock",
    verifyToken,
    requireAdmin,
    lockCourseById,
  );
  router.patch(
    "/api/admin/courses/:course_id/unlock",
    verifyToken,
    requireAdmin,
    unlockCourseById,
  );
  // Quick Export
  router.get(
    "/api/admin/courses/export",
    verifyToken,
    requireAdmin,
    exportCoursesToExcel,
  );

  //===========Module Management Routes===========

  router.get(
    "/api/admin/modules/paginated",
    verifyToken,
    requireAdmin,
    getModulesPaginated,
  );
  router.get(
    "/api/admin/modules/:module_id",
    verifyToken,
    requireAdmin,
    getModuleById,
  );
  router.post(
    "/api/admin/courses/:course_id/modules",
    verifyToken,
    requireAdmin,
    createModule,
  );
  router.put(
    "/api/admin/modules/:module_id",
    verifyToken,
    requireAdmin,
    updateModuleById,
  );
  router.get(
    "/api/admin/courses/:course_id/modules",
    verifyToken,
    requireAdmin,
    getModulesPaginated,
  );

  //===========Skill Management Routes===========
  router.get(
    "/api/admin/skills/paginated",
    verifyToken,
    requireAdmin,
    getSkillsPaginated,
  );
  router.get(
    "/api/admin/skills/:skill_id",
    verifyToken,
    requireAdmin,
    getSkillById,
  );
  router.post("/api/admin/skills", verifyToken, requireAdmin, createSkill);
  router.put(
    "/api/admin/skills/:skill_id",
    verifyToken,
    requireAdmin,
    updateSkill,
  );

  //===========Certificate-Skill Management Routes===========
  router.get(
    "/api/admin/certificate-skills/paginated",
    verifyToken,
    requireAdmin,
    getCertificateSkillsPaginated,
  );
  router.get(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    getCertificateSkillById,
  );
  router.post(
    "/api/admin/certificate-skills",
    verifyToken,
    requireAdmin,
    createCertificateSkill,
  );
  router.put(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    updateCertificateSkill,
  );
  router.delete(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    deleteCertificateSkill,
  );

  //===========Lesson Management Routes===========
  router.get(
    "/api/admin/lessons/paginated",
    verifyToken,
    requireAdmin,
    getLessonsPaginated,
  );
  router.get(
    "/api/admin/lessons/:lesson_id",
    verifyToken,
    requireAdmin,
    getLessonById,
  );
  router.post("/api/admin/lessons", verifyToken, requireAdmin, createLesson);
  router.put(
    "/api/admin/lessons/:lesson_id",
    verifyToken,
    requireAdmin,
    updateLessonById,
  );
  router.patch(
    "/api/admin/lessons/:lesson_id/lock",
    verifyToken,
    requireAdmin,
    lockLesson,
  );
  router.patch(
    "/api/admin/lessons/:lesson_id/unlock",
    verifyToken,
    requireAdmin,
    unlockLesson,
  );
  // Quick Export
  router.get(
    "/api/admin/lessons/export",
    verifyToken,
    requireAdmin,
    exportLessonsToExcel,
  );

  //===========Lesson Media Management Routes===========
  router.get(
    "/api/admin/lesson-medias/paginated",
    verifyToken,
    requireAdmin,
    getMediasPaginated,
  );
  router.get(
    "/api/admin/lesson-medias/:media_id",
    verifyToken,
    requireAdmin,
    getMediaById,
  );
  router.get(
    "/api/admin/lessons/:lesson_id/medias",
    verifyToken,
    requireAdmin,
    getMediasByLessonId,
  );
  router.post(
    "/api/admin/lesson-medias/:lesson_id",
    verifyToken,
    requireAdmin,
    createMedia,
  );
  router.put(
    "/api/admin/lesson-medias/:media_id",
    verifyToken,
    requireAdmin,
    updateMediaById,
  );
  router.delete(
    "/api/admin/lesson-medias/:media_id",
    verifyToken,
    requireAdmin,
    deleteMedia,
  );

  //===========Lesson Question Management Routes===========
  router.get(
    "/api/admin/lesson-questions/paginated",
    verifyToken,
    requireAdmin,
    getQuestionsPaginated,
  );
  router.get(
    "/api/admin/lessons/:lesson_id/questions",
    verifyToken,
    requireAdmin,
    getQuestionsByLessonIdPaginated,
  );
  router.get(
    "/api/admin/lesson-questions/:lesson_question_id",
    verifyToken,
    requireAdmin,
    getQuestionById,
  );
  router.post(
    "/api/admin/lesson-questions",
    verifyToken,
    requireAdmin,
    createQuestion,
  );
  router.put(
    "/api/admin/lesson-questions/:lesson_question_id",
    verifyToken,
    requireAdmin,
    updateQuestion,
  );
  router.patch(
    "/api/admin/lesson-questions/:lesson_question_id/lock",
    verifyToken,
    requireAdmin,
    lockQuestion,
  );
  router.patch(
    "/api/admin/lesson-questions/:lesson_question_id/unlock",
    verifyToken,
    requireAdmin,
    unlockQuestion,
  );

  //===========Roadmap Management Routes===========
  router.get(
    "/api/admin/roadmaps/paginated",
    verifyToken,
    requireAdmin,
    getRoadmapsPaginated,
  );
  router.get(
    "/api/admin/roadmaps/:roadmap_id",
    verifyToken,
    requireAdmin,
    getRoadmapById,
  );
  router.post("/api/admin/roadmaps", verifyToken, requireAdmin, createRoadmap);
  router.put(
    "/api/admin/roadmaps/:roadmap_id",
    verifyToken,
    requireAdmin,
    updateRoadmap,
  );
  router.patch(
    "/api/admin/roadmaps/:roadmap_id/lock",
    verifyToken,
    requireAdmin,
    lockRoadmap,
  );
  router.patch(
    "/api/admin/roadmaps/:roadmap_id/unlock",
    verifyToken,
    requireAdmin,
    unlockRoadmap,
  );
  // Quick Export
  router.get(
    "/api/admin/roadmaps/export",
    verifyToken,
    requireAdmin,
    exportRoadmapsToExcel,
  );

  //===========Phase Management Routes===========
  router.get(
    "/api/admin/roadmaps/:roadmap_id/phases",
    verifyToken,
    requireAdmin,
    getPhasesByRoadmapId,
  );
  router.get(
    "/api/admin/phases/:phase_id",
    verifyToken,
    requireAdmin,
    getPhaseById,
  );
  router.post(
    "/api/admin/roadmaps/:roadmap_id/phases",
    verifyToken,
    requireAdmin,
    createPhase,
  );
  router.put(
    "/api/admin/phases/:phase_id",
    verifyToken,
    requireAdmin,
    updatePhase,
  );

  //===========Phase Course Management Routes===========
  router.get(
    "/api/admin/phases/:phase_id/phase-courses",
    verifyToken,
    requireAdmin,
    getPhaseCoursesByPhaseId,
  );
  router.post(
    "/api/admin/phases/:phase_id/phase-courses",
    verifyToken,
    requireAdmin,
    createPhaseCourse,
  );
  router.put(
    "/api/admin/phase-courses/:phase_course_id",
    verifyToken,
    requireAdmin,
    updatePhaseCourse,
  );
  router.delete(
    "/api/admin/phase-courses/:phase_course_id",
    verifyToken,
    requireAdmin,
    removeCourseFromPhase,
  );

  //===========Document Management Routes===========
  router.get(
    "/api/admin/documents/paginated",
    verifyToken,
    requireAdmin,
    getDocumentsPaginated,
  );
  router.post(
    "/api/admin/documents",
    verifyToken,
    requireAdmin,
    createDocument,
  );
  router.get(
    "/api/admin/documents/:document_id",
    verifyToken,
    requireAdmin,
    getDocumentById,
  );
  router.put(
    "/api/admin/documents/:document_id",
    verifyToken,
    requireAdmin,
    updateDocument,
  );
  router.delete(
    "/api/admin/documents/:document_id",
    verifyToken,
    requireAdmin,
    deleteDocument,
  );
  // Quick Export
  router.get(
    "/api/admin/documents/export",
    verifyToken,
    requireAdmin,
    exportDocumentsToExcel,
  );

  //===========Document Phase Management Routes===========
  router.get(
    "/api/admin/phases/:phase_id/document-phases",
    verifyToken,
    requireAdmin,
    getDocumentPhases,
  );
  router.post(
    "/api/admin/phases/:phase_id/document-phases",
    verifyToken,
    requireAdmin,
    createDocumentPhase,
  );
  router.put(
    "/api/admin/document-phases/:document_phase_id",
    verifyToken,
    requireAdmin,
    updateDocumentPhase,
  );
  router.delete(
    "/api/admin/document-phases/:document_phase_id",
    verifyToken,
    requireAdmin,
    deleteDocumentPhase,
  );

  //===========Module Lesson Management Routes===========
  router.get(
    "/api/admin/modules/:module_id/module-lessons",
    verifyToken,
    requireAdmin,
    getModuleLessons,
  );
  router.post(
    "/api/admin/modules/:module_id/module-lessons",
    verifyToken,
    requireAdmin,
    createModuleLesson,
  );
  router.put(
    "/api/admin/module-lessons/:module_lesson_id",
    verifyToken,
    requireAdmin,
    updateModuleLesson,
  );
  router.delete(
    "/api/admin/module-lessons/:module_lesson_id",
    verifyToken,
    requireAdmin,
    deleteModuleLesson,
  );

  //===========Blog Management Routes===========
  router.get(
    "/api/admin/blogs/paginated",
    verifyToken,
    requireAdmin,
    getBlogsPaginated,
  );
  router.get(
    "/api/admin/blogs/:blog_id",
    verifyToken,
    requireAdmin,
    getBlogById,
  );
  router.get(
    "/api/admin/blogs/slug/:slug",
    verifyToken,
    requireAdmin,
    getBlogBySlug,
  );
  router.post(
    "/api/admin/blogs",
    verifyToken,
    requireAdmin,
    upload.single("file"),
    createBlog,
  );
  router.put(
    "/api/admin/blogs/:blog_id",
    verifyToken,
    requireAdmin,
    upload.single("file"),
    updateBlog,
  );
  router.patch(
    "/api/admin/blogs/:blog_id/status",
    verifyToken,
    requireAdmin,
    updateBlogStatus,
  );
  router.delete(
    "/api/admin/blogs/:blog_id",
    verifyToken,
    requireAdmin,
    deleteBlog,
  );
  // Quick Export
  router.get(
    "/api/admin/blogs/export",
    verifyToken,
    requireAdmin,
    exportBlogsToExcel,
  );

  // Public Blog Routes (không cần authentication)
  router.get("/api/blogs/latest", getLatestBlogs);
  router.get("/api/blogs/popular", getPopularBlogs);
  router.get("/api/blogs/slug/:slug", getBlogBySlug); // Public access

  //===========Report Management Routes===========
  router.get(
    "/api/admin/reports/paginated",
    verifyToken,
    requireAdmin,
    getReportsPaginated,
  );
  router.get(
    "/api/admin/reports/:report_id",
    verifyToken,
    requireAdmin,
    getReportById,
  );
  router.post(
    "/api/admin/reports/generate",
    verifyToken,
    requireAdmin,
    generateReport,
  );
  router.get(
    "/api/admin/reports/:report_id/download",
    verifyToken,
    requireAdmin,
    downloadReport,
  );
  router.delete(
    "/api/admin/reports/:report_id",
    verifyToken,
    requireAdmin,
    deleteReport,
  );

  //===========Exam Management Routes===========
  // Exam CRUD
  router.get(
    "/api/admin/exams/paginated",
    verifyToken,
    requireAdmin,
    getExamsPaginated,
  );
  router.get(
    "/api/admin/exams/:exam_id",
    verifyToken,
    requireAdmin,
    getExamById,
  );
  router.get(
    "/api/admin/exams/:exam_id/details",
    verifyToken,
    requireAdmin,
    getExamWithDetails,
  );
  router.post("/api/admin/exams", verifyToken, requireAdmin, createExam);
  router.put(
    "/api/admin/exams/:exam_id",
    verifyToken,
    requireAdmin,
    updateExamById,
  );
  router.delete(
    "/api/admin/exams/:exam_id",
    verifyToken,
    requireAdmin,
    deleteExamById,
  );
  // Quick Export
  router.get(
    "/api/admin/exams/export",
    verifyToken,
    requireAdmin,
    exportExamsToExcel,
  );

  // Exam Container Management
  router.get(
    "/api/admin/exams/:exam_id/containers",
    verifyToken,
    requireAdmin,
    getContainersByExamId,
  );
  router.post(
    "/api/admin/exam-containers",
    verifyToken,
    requireAdmin,
    createExamContainer,
  );
  router.put(
    "/api/admin/exam-containers/:container_id",
    verifyToken,
    requireAdmin,
    updateExamContainer,
  );
  router.delete(
    "/api/admin/exam-containers/:container_id",
    verifyToken,
    requireAdmin,
    deleteExamContainer,
  );

  // Question Management
  router.post(
    "/api/admin/questions",
    verifyToken,
    requireAdmin,
    createExamQuestion,
  );
  router.put(
    "/api/admin/questions/:question_id",
    verifyToken,
    requireAdmin,
    updateExamQuestion,
  );
  router.delete(
    "/api/admin/questions/:question_id",
    verifyToken,
    requireAdmin,
    deleteExamQuestion,
  );

  // Container Question Management
  router.post(
    "/api/admin/container-questions",
    verifyToken,
    requireAdmin,
    addQuestionToContainer,
  );
  router.delete(
    "/api/admin/container-questions/:container_question_id",
    verifyToken,
    requireAdmin,
    removeQuestionFromContainer,
  );
  router.patch(
    "/api/admin/container-questions/:container_question_id/order",
    verifyToken,
    requireAdmin,
    updateQuestionOrderInContainer,
  );

  // Question Options Management
  router.post(
    "/api/admin/question-options",
    verifyToken,
    requireAdmin,
    createQuestionOption,
  );
  router.put(
    "/api/admin/question-options/:question_option_id",
    verifyToken,
    requireAdmin,
    updateQuestionOption,
  );
  router.delete(
    "/api/admin/question-options/:question_option_id",
    verifyToken,
    requireAdmin,
    deleteQuestionOption,
  );

  // Exam Media Management
  router.get(
    "/api/admin/exams/:exam_id/media",
    verifyToken,
    requireAdmin,
    getExamMediaByExamId,
  );
  router.post(
    "/api/admin/exam-media",
    verifyToken,
    requireAdmin,
    createExamMedia,
  );
  router.delete(
    "/api/admin/exam-media/:media_id",
    verifyToken,
    requireAdmin,
    deleteExamMedia,
  );

  app.use("/", router);
};

export default initAdminRoutes;
