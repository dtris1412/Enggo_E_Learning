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
  deleteCourse,
  getCoursesByCertificateId,
  getCourseById,
  getCoursePaginated,
} from "../controllers/courseController.js";

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
    "/api/admin/certificates/:certificate_id/courses",
    verifyToken,
    requireAdmin,
    getCoursesByCertificateId
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
  router.delete(
    "/api/admin/courses/:course_id",
    verifyToken,
    requireAdmin,
    deleteCourse
  );

  app.use("/", router);
};

export default initAdminRoutes;
