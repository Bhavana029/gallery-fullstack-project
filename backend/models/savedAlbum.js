const mongoose = require("mongoose");

const savedAlbumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  savedAt: { type: Date, default: Date.now }
});

const SavedAlbum = mongoose.model("SavedAlbum", savedAlbumSchema);
module.exports = SavedAlbum;
