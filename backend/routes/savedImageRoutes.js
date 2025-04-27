const express = require("express");
const {  saveImage } = require("../controllers/savedImageController"); // Correct import
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/save', saveImage); 






  
module.exports = router;
