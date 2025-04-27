const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
}, { timestamps: true });

module.exports = mongoose.model("Image", ImageSchema);
