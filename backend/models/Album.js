const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store user ID
  albumName: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  coverImage: { type: String, required: true },
  images: [{ type: String }],
});

module.exports = mongoose.model("Album", albumSchema);
