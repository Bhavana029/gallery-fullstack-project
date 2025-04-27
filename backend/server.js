const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const albumRoutes = require("./routes/albumRoutes");
const path = require("path");
const favoriteRoutes = require("./routes/favoriteImageRoutes");
const saveRoute = require("./routes/savedImageRoutes")
// const savedItemsRoutes = require('./routes/savedItems');
const authMiddleware = require('./middlewares/authMiddleware');
require("dotenv").config();

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',  // Allow your frontend React app to access the API
  credentials: true,               // Allow cookies to be sent with requests if required
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
connectDB();


const savedRoutes = require('./routes/saved');
app.use('/api/saved', savedRoutes);

app.get("/", (req, res) => res.send("Congratulation 🎉🎉! Our Express server is Running on Vercel"));
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/save",saveRoute)


app.get("/api/saved", async (req, res) => {
    try {
      const userId = req.user.id;
      const savedImages = await Image.find({ savedBy: userId });
      const savedAlbums = await Album.find({ savedBy: userId }).populate("images");
  
      res.json({ images: savedImages, albums: savedAlbums });
    } catch (error) {
      res.status(500).json({ error: "Server error fetching saved items" });
    }
  });
  app.get("/api/favorites", async (req, res) => {
    try {
      const userId = req.user.id;
      const favoriteImages = await Image.find({ favoritedBy: userId });
      const favoriteAlbums = await Album.find({ favoritedBy: userId }).populate("images");
  
      res.json({ images: favoriteImages, albums: favoriteAlbums });
    } catch (error) {
      res.status(500).json({ error: "Server error fetching favorite items" });
    }
  });
  
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
