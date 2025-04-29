const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2; // Make sure you import Cloudinary

// Upload Image
exports.uploadImage = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Check if userId is provided
    if (!req.body.userId) return res.status(400).json({ message: "User ID is required" });

    // Cloudinary returns the URL of the uploaded image in req.file.path
    const imageUrl = req.file.path;

    const newImage = new Image({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      imageUrl, // Save Cloudinary image URL
      userId: req.body.userId, // Save associated user ID
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

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let query = { userId }; // Base query to filter by user ID

    // If search term exists, filter by title
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

// Delete image from Cloudinary and database
exports.deleteImage = async (req, res) => {
  try {
    const photoId = req.params.photoId;

    // Find the image by its ID in the database
    const image = await Image.findById(photoId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Extract publicId from the image URL (if stored in Cloudinary)
    const publicId = image.imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

    // Delete the image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

    if (cloudinaryResponse.result === "ok") {
      console.log("Image deleted from Cloudinary successfully.");
    } else {
      console.log("Cloudinary error:", cloudinaryResponse);
    }

    // Delete the image record from the database
    await image.deleteOne(); // Use deleteOne() instead of remove()

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};
