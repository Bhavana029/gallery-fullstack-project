const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Store user ID
  },
  albumName: {
    type: String,
    required: true, // Store album name
  },
  description: {
    type: String,
    required: true, // Store album description
  },
  tags: [String], // Store tags as an array of strings
  coverImage: {
    type: String,
    required: true, // Store Cloudinary URL of the cover image
  },
  images: [
    {
      type: String, // Store Cloudinary URLs of album images
    },
  ],
}, { timestamps: true }); // Adding timestamps to track creation and update times

module.exports = mongoose.model("Album", albumSchema);
