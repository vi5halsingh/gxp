import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If first user or specific admin email, make admin, otherwise pending
    const isFirstUser = (await User.countDocuments()) === 0;
    const initialRole = isFirstUser ? "admin" : "pending";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: initialRole,
    });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message:
        user.role === "admin"
          ? "Admin account created successfully"
          : "Registration successful. Awaiting admin role assignment.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// 2. Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// 3. Get Current Logged-in User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};

// 4. Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// 5. Assign Role (Admin only)
export const assignRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'user' or 'seller'",
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