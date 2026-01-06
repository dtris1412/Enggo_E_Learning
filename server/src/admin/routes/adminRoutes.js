import express from "express";
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
  app.use("/", router);
};

export default initAdminRoutes;
