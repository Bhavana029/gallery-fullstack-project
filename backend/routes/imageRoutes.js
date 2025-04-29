const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Middleware for handling file uploads to Cloudinary
const imageController = require("../controllers/imageController");

// Route to upload image
router.post("/upload", upload.single("image"), imageController.uploadImage);

// Route to get images for a specific user
router.get("/user/:userId", imageController.getImagesByUser);

// Route to delete an image
router.delete("/delete/:photoId", imageController.deleteImage);

module.exports = router;
