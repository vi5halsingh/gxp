import inputmodel from "../models/input.models.js";

// 1. Create a dynamic input field (Admin only)
export const createInput = async (req, res) => {
  try {
    const { label, name, type, role, required } = req.body;

    if (!label || !role) {
      return res.status(400).json({
        success: false,
        message: "Label and role are required",
      });
    }

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be 'user' or 'seller'",
      });
    }

    // Auto-generate name key if not provided
    const fieldName =
      (name && name.trim()) ||
      label
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "_");

    // Check if field with same name exists for this role
    const isExist = await inputmodel.findOne({
      name: fieldName,
      role: role,
    });

    if (isExist) {
      return res.status(409).json({
        success: false,
        message: `Field '${fieldName}' already exists for role '${role}'`,
      });
    }

    const newInput = await inputmodel.create({
      label: label.trim(),
      name: fieldName,
      type: type || "text",
      role: role,
      required: required !== undefined ? required : true,
    });

    return res.status(201).json({
      success: true,
      message: "Input field created successfully",
      data: newInput,
    });
  } catch (error) {
    console.error("Create input error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create input field",
    });
  }
};

// 2. Get input fields for a specific role
export const getInputsByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be 'user' or 'seller'",
      });
    }

    const inputs = await inputmodel.find({ role }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: inputs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch input fields",
    });
  }
};

// 3. Get all inputs (in creation order)
export const getAllInputs = async (req, res) => {
  try {
    const inputs = await inputmodel.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      data: inputs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inputs",
    });
  }
};

// 4. Delete an input field (Admin only)
export const deleteInput = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await inputmodel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Input field not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Input field deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete input field",
    });
  }
};