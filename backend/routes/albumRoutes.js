const express = require("express");
const { createAlbum, getAlbums } = require("../controllers/albumController");
const Album = require("../models/Album");
const upload = require("../middlewares/upload");

const path = require("path");
const fs = require("fs");
const albumController = require("../controllers/albumController");

const router = express.Router();

// ✅ Album Creation Route (Upload Cover Image + Multiple Images)
router.post(
  "/create",
  upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 10 }]),
  async (req, res) => {
    try {
      const { albumName, description, tags, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Upload Cover Image to Cloudinary
      const coverImageUrl = await uploadToCloudinary(req.files["coverImage"][0]);

      // Upload other images to Cloudinary
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

// ✅ Fetch All Albums Route
router.get("/", getAlbums);

// ✅ Delete Image from Cloudinary
router.delete("/deleteImage", async (req, res) => {
  try {
    const { albumId, imageUrl } = req.body;
    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ success: false, message: "Album not found" });

    // Remove image URL from album
    album.images = album.images.filter((img) => img !== imageUrl);
    await album.save();

    // Extract Cloudinary public ID and delete the image
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID from the URL
    await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Save Album
router.post("/save", albumController.saveAlbum);

// ✅ Favorite Album
router.post("/favorite", albumController.favoriteAlbum);

// ✅ Delete Album (from Cloudinary and DB)
router.delete("/delete", albumController.deleteAlbum);

module.exports = router;
