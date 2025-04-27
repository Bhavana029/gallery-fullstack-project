import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
const API_BASE_URL5 = `${process.env.REACT_APP_API_BASE_URL}`;
const UploadForm = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // Get logged-in user ID from local storage (or context API if using it)
  const userId = localStorage.getItem("userId"); // Ensure user ID is stored during login

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image.");
    if (!userId) return alert("User not logged in.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("userId", userId); // Include user ID in request

    try {
      await axios.post(`${API_BASE_URL5}/api/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image uploaded successfully!");
      onClose();
    } catch (error) {
      alert("Upload failed! Try again.");
    }
  };

  return (
    <div className="upload-modal">
      <div className="modal-content1">
        <h3>Upload Image</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="text" placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)} required />
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="submit">Upload</button>
        </form>
        <button className="close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default UploadForm;
