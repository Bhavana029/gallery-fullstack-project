const SavedImage = require("../models/SavedImage");
const Photo = require("../models/Image");

// Save an image
const saveImage = async (req, res) => {
  try {
    const { imageUrl, title, userId } = req.body;

    if (!imageUrl || !title || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSavedImage = new SavedImage({ imageUrl, title, userId });
    await newSavedImage.save();

    res.status(201).json({ message: "Image saved successfully", image: newSavedImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get saved images for a user


// **Export all functions**



module.exports = {
  saveImage

};
