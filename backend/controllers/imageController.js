const Image = require("../models/Image");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (!req.body.userId) return res.status(400).json({ message: "User ID is required" });

    const newImage = new Image({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      imageUrl: req.file.filename, // Store only filename
      userId: req.body.userId, // Store the associated user
    });

    await newImage.save();
    res.status(201).json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};

// Fetch images for a specific user
exports.getImagesByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from request parameters
    const { search } = req.query; // Get search query (optional)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let query = { userId }; // Base query to filter by user ID

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search by title
    }

    const images = await Image.find(query).sort({ createdAt: -1 }); // Sort by latest uploaded

    if (!images.length) {
      return res.status(404).json({ message: "No images found" });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Failed to fetch images", error });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.photoId);
    res.json({ message: "Image deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};