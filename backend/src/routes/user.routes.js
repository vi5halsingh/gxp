import express from "express"
import { assignRole } from "../controllers/user.controllers.js";
const router = express.Router()
import { authenticate, authorize } from "../middlewares/auth.moddleware.js";

router.patch(
  "/:userId/role",
  authenticate,
  authorize("admin"),
  assignRole
);

export default router;