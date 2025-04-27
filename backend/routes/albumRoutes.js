const express = require("express");
const { createAlbum, getAlbums} = require("../controllers/albumController");
const Album=require("../models/Album")
const upload = require("../middlewares/upload"); // ✅ Import file upload middleware
const path = require('path');
const fs = require('fs');
const albumController=require("../controllers/albumController")

const router = express.Router();

// ✅ Album Creation Route (Upload Cover Image + Multiple Images)
router.post("/create", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 10 }]), createAlbum);

// ✅ Fetch All Albums Route
router.get("/", getAlbums);

// ✅ Delete Album Route
// router.delete("/:albumId", deleteImage);
// router.post("/uploadImage", upload.single("image"), async (req, res) => {
//   try {
//     const { albumId } = req.body;
//     const album = await Album.findById(albumId);
//     if (!album) return res.status(404).json({ error: "Album not found" });

//     album.images.push(req.file.filename);
//     await album.save();

//     res.json({ message: "Image uploaded successfully", imagePath: req.file.filename });
//   } catch (error) {
//     res.status(500).json({ error: "Error uploading image" });
//   }
// });
router.delete("/deleteImage", async (req, res) => {
  try {
    const { albumId, imageName } = req.body;
    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ success: false, message: "Album not found" });

    album.images = album.images.filter((img) => img !== imageName);
    await album.save();

    const imagePath = path.join(__dirname, "../uploads", imageName);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const album = await Album.findById(req.body.albumId);
    if (!album) return res.status(404).json({ success: false, message: "Album not found" });

    album.images.push(req.file.filename);
    await album.save();

    res.json({ success: true, imagePath: req.file.filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/save", albumController.saveAlbum);  // Save album
router.post("/favorite", albumController.favoriteAlbum);  // Favorite album
router.delete("/delete", albumController.deleteAlbum);  // Delete album


module.exports = router;
