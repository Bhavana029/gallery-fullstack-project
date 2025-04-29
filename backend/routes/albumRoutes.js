const express = require("express");
const { getAlbums } = require("../controllers/albumController");
const Album = require("../models/Album");
const upload = require("../middlewares/upload");
const path = require("path");
const fs = require("fs");
const albumController = require("../controllers/albumController");

const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload images to Cloudinary
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

const router = express.Router();

// ✅ Album Creation Route (with file uploads)
router.post(
  "/create",
  upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 10 }]), // Handling file uploads
  async (req, res) => {
    try {
      const { albumName, description, tags, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Upload the cover image to Cloudinary
      const coverImageUrl = await uploadToCloudinary(req.files["coverImage"][0]);

      const imagesUrls = [];
      if (req.files["images"]) {
        for (const file of req.files["images"]) {
          const imageUrl = await uploadToCloudinary(file);
          imagesUrls.push(imageUrl);
        }
      }

      const newAlbum = new Album({
        userId,
        albumName,
        description,
        tags,
        coverImage: coverImageUrl,
        images: imagesUrls,
      });

      await newAlbum.save();
      res.status(201).json({ message: "Album created successfully", album: newAlbum });
    } catch (error) {
      console.error("Error creating album:", error);
      res.status(500).json({ error: "Failed to create album" });
    }
  }
);

// ✅ Fetch Albums Route
router.get("/", getAlbums);

// ✅ Delete Image from Cloudinary
router.delete("/deleteImage", async (req, res) => {
  try {
    const { albumId, imageUrl } = req.body;
    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ success: false, message: "Album not found" });

    album.images = album.images.filter((img) => img !== imageUrl);
    await album.save();

    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/uploadImage", async (req, res) => {
  try {
    // Your logic for uploading an image here
    const imageUrl = await uploadToCloudinary(req.files["image"][0]);
    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// ✅ Save Album
router.post("/save", albumController.saveAlbum);

// ✅ Favorite Album
router.post("/favorite", albumController.favoriteAlbum);

// ✅ Delete Album
router.delete("/delete", albumController.deleteAlbum);

module.exports = router;
