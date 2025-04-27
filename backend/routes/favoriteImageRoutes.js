const express = require("express");
const {
  saveFavoriteImage

} = require("../controllers/favoriteImageController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/save", authMiddleware, saveFavoriteImage);

module.exports = router;
