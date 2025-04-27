const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Image = require('../models/Image');

// 👉 Save an image
router.post('/save', async (req, res) => {
    const { userId, imageId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user.savedImages.includes(imageId)) {
        user.savedImages.push(imageId);
        await user.save();
      }
      res.json({ message: 'Image saved successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save image' });
    }
  });
  


module.exports = router;
