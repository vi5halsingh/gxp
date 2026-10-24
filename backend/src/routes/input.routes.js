import express from "express";
import {
  createInput,
  getInputsByRole,
  getAllInputs,
  deleteInput,
} from "../controllers/input.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.moddleware.js";

const router = express.Router();

// Get all fields (Authenticated users/sellers or admin)
router.get("/all", authenticate, getAllInputs);

// Get fields for a specific role (Authenticated users/sellers or admin)
router.get("/role/:role", authenticate, getInputsByRole);

// Admin-only management routes
router.post("/", authenticate, authorize("admin"), createInput);
router.delete("/:id", authenticate, authorize("admin"), deleteInput);

export default router;
