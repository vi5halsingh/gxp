import inputmodel from "../models/input.models.js";
import Profile from "../models/profile.model.js";

// Save or update profile data
export const saveProfile = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Profile data is required",
      });
    }

    if (req.user.role === "pending") {
      return res.status(403).json({
        success: false,
        message: "Cannot submit profile while role is pending assignment",
      });
    }

    // Only allow updating fields permitted for this user's role
    const allowedInputs = await inputmodel.find({ role: req.user.role });
    const allowedFieldNames = new Set(allowedInputs.map((f) => f.name));

    // Get existing profile to preserve other role's data if any exists
    const existingProfile = await Profile.findOne({ user: req.user._id });
    const existingData = existingProfile?.data instanceof Map
      ? Object.fromEntries(existingProfile.data)
      : (existingProfile?.data || {});

    const updatedData = { ...existingData };

    // Update only the fields that belong to the user's role
    for (const [key, value] of Object.entries(data)) {
      if (allowedFieldNames.has(key)) {
        updatedData[key] = value;
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          user: req.user._id,
          role: req.user.role,
          data: updatedData,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Save profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
    });
  }
};

// Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
