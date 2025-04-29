const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  imageUrl: String, // Store the Cloudinary image URL
  userId: mongoose.Schema.Types.ObjectId, // Associated user
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
