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
// In your albumController.js or similar
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    
    const imageUrl = cloudinaryResult.secure_url;
    const albumId = req.body.albumId;

    // Add the image URL to the album
    const album = await Album.findById(albumId);
    album.images.push(imageUrl);
    await album.save();

    res.json({ success: true, imagePath: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// ✅ Save Album
router.post("/save", albumController.saveAlbum);

// ✅ Favorite Album
router.post("/favorite", albumController.favoriteAlbum);

// ✅ Delete Album
router.delete("/delete", albumController.deleteAlbum);

module.exports = router;
