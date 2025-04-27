const Album = require("../models/Album");
const mongoose = require("mongoose");
const SavedAlbum = require("../models/savedAlbum");
const FavoriteAlbum = require("../models/favoriteAlbum");


// Create Album
exports.createAlbum = async (req, res) => {
  try {
    const { albumName, description, tags, userId } = req.body;
    const coverImage = req.files["coverImage"][0].filename;
    const images = req.files["images"] ? req.files["images"].map((file) => file.filename) : [];

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newAlbum = new Album({ userId, albumName, description, tags, coverImage, images });
    await newAlbum.save();

    res.status(201).json({ message: "Album created successfully", album: newAlbum });
  } catch (error) {
    res.status(500).json({ error: "Failed to create album" });
  }
};

// Get Albums
exports.getAlbums = async (req, res) => {
  try {
    let { userId, search } = req.query;

    console.log("Received userId:", userId);
    console.log("Received search:", search);

    // Validate userId before querying
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    let query = {};
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);
    if (search) query.albumName = { $regex: search, $options: "i" };

    console.log("Final query:", query);

    const albums = await Album.find(query).sort({ createdAt: -1 });

    console.log("Fetched albums:", albums);
    res.status(200).json({ albums });

  } catch (error) {
    console.error("❌ Error fetching albums:", error.message);  // Prints exact error
    res.status(500).json({ error: error.message });  // Returns actual error message
  }
};

// Delete Album
// exports.deleteImage = async (req, res) => {
//   try {
//     const { albumId, imageName } = req.body;
//     if (!albumId || !imageName) {
//       return res.status(400).json({ error: "Album ID and Image Name are required" });
//     }

//     const album = await Album.findById(albumId);
//     if (!album) {
//       return res.status(404).json({ error: "Album not found" });
//     }

//     album.images = album.images.filter((img) => img !== imageName);
//     await album.save();

//     res.status(200).json({ message: "Image deleted successfully", album });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: "Failed to delete image" });
//   }
// };
exports.saveAlbum = async (req, res) => {
  const { userId, albumId } = req.body;

  try {
    const savedAlbum = new SavedAlbum({ userId, albumId });
    await savedAlbum.save();
    res.status(201).json({ message: "Album saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving album" });
  }
};

// Add album to favorites
exports.favoriteAlbum = async (req, res) => {
  const { userId, albumId } = req.body;

  try {
    const favoriteAlbum = new FavoriteAlbum({ userId, albumId });
    await favoriteAlbum.save();
    res.status(201).json({ message: "Album added to favorites" });
  } catch (error) {
    res.status(500).json({ error: "Error favoriting album" });
  }
};

// Delete album (from both frontend and backend)
exports.deleteAlbum = async (req, res) => {
  const { albumId } = req.body;

  try {
    // Delete album from the Albums collection
    await Album.findByIdAndDelete(albumId);
    // Delete associated saved and favorite entries
    await SavedAlbum.deleteMany({ albumId });
    await FavoriteAlbum.deleteMany({ albumId });

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting album" });
  }
};
