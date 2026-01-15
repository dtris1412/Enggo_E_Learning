import express, { Router } from "express";
import {
  requireAdmin,
  requireAuth,
  requireRole,
  requireUser,
  verifyToken,
} from "../../middleware/authMiddleware.js";
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
} from "../controllers/userController.js";

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
const router = express.Router();

const initAdminRoutes = (app) => {
  //===========User Management Routes===========
  router.get(
    "/api/admin/users/paginated",
    verifyToken,
    requireAdmin,
    getUsersPaginated
  );
  router.get("/api/admin/users", verifyToken, requireAdmin, getAllUsers);

  router.get(
    "/api/admin/users/:user_id",
    verifyToken,
    requireAdmin,
    getUserById
  );

  router.post("/api/admin/users", verifyToken, requireAdmin, createUser);
  router.put(
    "/api/admin/users/:user_id",
    verifyToken,
    requireAdmin,
    updateUserById
  );
  router.patch(
    "/api/admin/users/:user_id/lock",
    verifyToken,
    requireAdmin,
    lockUser
  );
  router.patch(
    "/api/admin/users/:user_id/unlock",
    verifyToken,
    requireAdmin,
    unlockUser
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
    getCertificatesPaginated
  );
  router.get(
    "/api/admin/certificates/:certificate_id",
    verifyToken,
    requireAdmin,
    getCertificateById
  );
  router.post(
    "/api/admin/certificates",
    verifyToken,
    requireAdmin,
    createCertificate
  );
  router.put(
    "/api/admin/certificates/:certificate_id",
    verifyToken,
    requireAdmin,
    updateCertificateById
  );
  router.patch(
    "/api/admin/certificates/:certificate_id/lock",
    verifyToken,
    requireAdmin,
    lockCertificate
  );
  router.patch(
    "/api/admin/certificates/:certificate_id/unlock",
    verifyToken,
    requireAdmin,
    unlockCertificate
  );

  //===========Course Management Routes===========
  router.get(
    "/api/admin/courses/paginated",
    verifyToken,
    requireAdmin,
    getCoursePaginated
  );
  router.get(
    "/api/admin/courses/:course_id",
    verifyToken,
    requireAdmin,
    getCourseById
  );
  router.post("/api/admin/courses", verifyToken, requireAdmin, createCourse);
  router.put(
    "/api/admin/courses/:course_id",
    verifyToken,
    requireAdmin,
    updateCourseById
  );
  router.patch(
    "/api/admin/courses/:course_id/lock",
    verifyToken,
    requireAdmin,
    lockCourseById
  );
  router.patch(
    "/api/admin/courses/:course_id/unlock",
    verifyToken,
    requireAdmin,
    unlockCourseById
  );

  //===========Module Management Routes===========

  router.get(
    "/api/admin/modules/paginated",
    verifyToken,
    requireAdmin,
    getModulesPaginated
  );
  router.get(
    "/api/admin/modules/:module_id",
    verifyToken,
    requireAdmin,
    getModuleById
  );
  router.post(
    "/api/admin/courses/:course_id/modules",
    verifyToken,
    requireAdmin,
    createModule
  );
  router.put(
    "/api/admin/modules/:module_id",
    verifyToken,
    requireAdmin,
    updateModuleById
  );
  router.get(
    "/api/admin/courses/:course_id/modules",
    verifyToken,
    requireAdmin,
    getModulesPaginated
  );

  //===========Skill Management Routes===========
  router.get(
    "/api/admin/skills/paginated",
    verifyToken,
    requireAdmin,
    getSkillsPaginated
  );
  router.get(
    "/api/admin/skills/:skill_id",
    verifyToken,
    requireAdmin,
    getSkillById
  );
  router.post("/api/admin/skills", verifyToken, requireAdmin, createSkill);
  router.put(
    "/api/admin/skills/:skill_id",
    verifyToken,
    requireAdmin,
    updateSkill
  );

  //===========Certificate-Skill Management Routes===========
  router.get(
    "/api/admin/certificate-skills/paginated",
    verifyToken,
    requireAdmin,
    getCertificateSkillsPaginated
  );
  router.get(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    getCertificateSkillById
  );
  router.post(
    "/api/admin/certificate-skills",
    verifyToken,
    requireAdmin,
    createCertificateSkill
  );
  router.put(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    updateCertificateSkill
  );
  router.delete(
    "/api/admin/certificate-skills/:certificate_skill_id",
    verifyToken,
    requireAdmin,
    deleteCertificateSkill
  );

  //===========Lesson Management Routes===========
  router.get(
    "/api/admin/lessons/paginated",
    verifyToken,
    requireAdmin,
    getLessonsPaginated
  );
  router.get(
    "/api/admin/lessons/:lesson_id",
    verifyToken,
    requireAdmin,
    getLessonById
  );
  router.post("/api/admin/lessons", verifyToken, requireAdmin, createLesson);
  router.put(
    "/api/admin/lessons/:lesson_id",
    verifyToken,
    requireAdmin,
    updateLessonById
  );
  router.patch(
    "/api/admin/lessons/:lesson_id/lock",
    verifyToken,
    requireAdmin,
    lockLesson
  );
  router.patch(
    "/api/admin/lessons/:lesson_id/unlock",
    verifyToken,
    requireAdmin,
    unlockLesson
  );
  app.use("/", router);
};

export default initAdminRoutes;
