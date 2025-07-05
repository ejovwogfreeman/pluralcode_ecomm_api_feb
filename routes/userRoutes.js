import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  updateProfilePic,
  getUserById,
  getAllUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);
router.patch("/profile-pic", protect, updateProfilePic);
router.get("/:id", protect, adminOnly, getUserById);
router.get("/", protect, adminOnly, getAllUsers);

export default router;
