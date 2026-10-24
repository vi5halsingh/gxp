import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // Role automatically defaults to "user"
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Awaiting admin role assignment.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};


export const assignRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role,
          roleAssignedBy: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Role assigned successfully: ${role}`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to assign role",
    });
  }
};