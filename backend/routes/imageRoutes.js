const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // ✅ middleware only
const imageController = require("../controllers/imageController");

// Use upload.single for handling image uploads
router.post("/upload", upload.single("image"), imageController.uploadImage);
router.get("/user/:userId", imageController.getImagesByUser);
router.delete("/delete/:photoId", imageController.deleteImage);

module.exports = router;
