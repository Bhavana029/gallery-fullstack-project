const mongoose = require("mongoose");

const favoriteAlbumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  favoritedAt: { type: Date, default: Date.now }
});

const FavoriteAlbum = mongoose.model("FavoriteAlbum", favoriteAlbumSchema);
module.exports = FavoriteAlbum;
