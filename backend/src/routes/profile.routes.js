import express from "express";
import {
  saveProfile,
  getMyProfile,
} from "../controllers/profile.controllers.js";
import { authenticate } from "../middlewares/auth.moddleware.js";

const router = express.Router();

router.get("/me", authenticate, getMyProfile);
router.post("/", authenticate, saveProfile);

export default router;
