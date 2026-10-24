import express from "express";
import {
  register,
  login,
  getMe,
  getAllUsers,
  assignRole,
} from "../controllers/user.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.moddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Authenticated user route
router.get("/me", authenticate, getMe);

// Admin-only routes
router.get("/all", authenticate, authorize("admin"), getAllUsers);
router.patch("/:userId/role", authenticate, authorize("admin"), assignRole);

export default router;