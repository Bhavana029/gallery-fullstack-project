const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Middleware for file uploads
const imageController = require("../controllers/imageController");









router.post("/upload", upload.single("image"), imageController.uploadImage);
router.get("/user/:userId", imageController.getImagesByUser); // Fetch images by user

router.delete("/delete/:photoId", imageController.deleteImage);

module.exports = router;
