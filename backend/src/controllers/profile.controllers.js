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

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          user: req.user._id,
          role: req.user.role,
          data: data,
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
