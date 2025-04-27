const mongoose = require('mongoose');

const favoriteImageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  },
  { timestamps: true }
);

const FavoriteImage = mongoose.model('FavoriteImage', favoriteImageSchema);
module.exports = FavoriteImage;
