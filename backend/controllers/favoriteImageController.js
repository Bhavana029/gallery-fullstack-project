const FavoriteImage = require("../models/FavoriteImage");
const Photo = require("../models/Image");

// ✅ Save an image to favorites
// Save favorite image
// In the saveFavoriteImage controller:
// In the saveFavoriteImage controller:
exports.saveFavoriteImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    const { userId } = req.user; // Assuming user is authenticated

    if (!userId || !imageId) {
      return res.status(400).json({ error: "Missing userId or imageId." });
    }

    console.log("Received userId and imageId:", userId, imageId); // Debugging step

    const newFavorite = new FavoriteImage({ userId, imageId });
    await newFavorite.save();

    res.status(201).json({ message: "Image added to favorites!" });
  } catch (error) {
    console.error("Error saving favorite image:", error.message); // Log the error message
    console.error("Stack trace:", error.stack); // Log the full error stack for more details
    res.status(500).json({ error: "Server error. Could not add image to favorites." });
  }
};


