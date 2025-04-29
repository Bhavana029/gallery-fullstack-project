const cloudinary = require("cloudinary").v2;// Import Cloudinary
const Album = require("../models/Album");
const mongoose = require("mongoose");
const SavedAlbum = require("../models/savedAlbum");
const FavoriteAlbum = require("../models/favoriteAlbum");


// Create Album with Cloudinary Upload
exports.createAlbum = async (req, res) => {
  try {
    const { albumName, description, tags, userId } = req.body;
    
    // Upload cover image to Cloudinary
    const coverImageFile = req.files["coverImage"][0];
    const coverImageResult = await cloudinary.uploader.upload(coverImageFile.path);
    const coverImageUrl = coverImageResult.secure_url; // Cloudinary URL of cover image

    // Upload images to Cloudinary (if present)
    const images = req.files["images"]
      ? await Promise.all(
          req.files["images"].map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url; // Cloudinary URL of the uploaded image
          })
        )
      : [];

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Create a new album
    const newAlbum = new Album({
      userId,
      albumName,
      description,
      tags,
      coverImage: coverImageUrl, // Store Cloudinary URL
      images, // Store array of Cloudinary URLs
    });

    await newAlbum.save();

    res.status(201).json({ message: "Album created successfully", album: newAlbum });
  } catch (error) {
    console.error("Error creating album:", error.message);
    res.status(500).json({ error: "Failed to create album" });
  }
};

// Get Albums
exports.getAlbums = async (req, res) => {
  try {
    let { userId, search } = req.query;

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    let query = {};
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);
    if (search) query.albumName = { $regex: search, $options: "i" };

    const albums = await Album.find(query).sort({ createdAt: -1 });
    res.status(200).json({ albums });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
};

// Save album to favorites
exports.saveAlbum = async (req, res) => {
  const { userId, albumId } = req.body;

  try {
    const savedAlbum = new SavedAlbum({ userId, albumId });
    await savedAlbum.save();
    res.status(201).json({ message: "Album saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving album" });
  }
};

// Add album to favorites
exports.favoriteAlbum = async (req, res) => {
  const { userId, albumId } = req.body;

  try {
    const favoriteAlbum = new FavoriteAlbum({ userId, albumId });
    await favoriteAlbum.save();
    res.status(201).json({ message: "Album added to favorites" });
  } catch (error) {
    res.status(500).json({ error: "Error favoriting album" });
  }
};

// Delete album
exports.deleteAlbum = async (req, res) => {
  const { albumId } = req.body;

  try {
    // Delete album from the Albums collection
    const album = await Album.findByIdAndDelete(albumId);
    if (album) {
      // Delete associated saved and favorite entries
      await SavedAlbum.deleteMany({ albumId });
      await FavoriteAlbum.deleteMany({ albumId });

      // Optionally, delete the images from Cloudinary (if required)
      await cloudinary.uploader.destroy(album.coverImage.split("/").pop().split(".")[0]);
      album.images.forEach(async (imgUrl) => {
        await cloudinary.uploader.destroy(imgUrl.split("/").pop().split(".")[0]);
      });

      res.status(200).json({ message: "Album deleted successfully" });
    } else {
      res.status(404).json({ error: "Album not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting album" });
  }
};
