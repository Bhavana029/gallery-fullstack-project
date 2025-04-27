import React, { useState } from "react";
import axios from "axios";
import "./CreateAlbumForm.css";
const API_BASE_URL1 = `${process.env.REACT_APP_API_BASE_URL}`;

function CreateAlbumForm({ onClose, userId }) {  // Accept userId as a prop
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    if (!coverImage || images.length === 0) {
      alert("Please upload a cover image and at least one additional image.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);  // Attach user ID
    formData.append("albumName", albumName);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("coverImage", coverImage);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(`${API_BASE_URL1}/api/albums/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Server Response:", response.data);
      alert("Album created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating album:", error.response?.data || error.message);
      alert("Failed to create album. Please try again.");
    }
  };

  return (
    <div className="album-form">
      <h2 >Create New Album</h2>
      <form onSubmit={handleAlbumSubmit}>
        <input 
          type="text" 
          placeholder="Album Name" 
          value={albumName} 
          onChange={(e) => setAlbumName(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Tags (comma-separated)" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)} 
        />
        
        <label>Cover Image:</label>
        <input className="file"
          type="file" 
          accept="image/*" 
          onChange={(e) => setCoverImage(e.target.files[0])} 
          required 
        />

        <label>Upload Multiple Images:</label>
        <input className="file"
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => setImages([...e.target.files])} 
          required 
        />

        <button type="submit">Create Album</button>
      </form>
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
}

export default CreateAlbumForm;
