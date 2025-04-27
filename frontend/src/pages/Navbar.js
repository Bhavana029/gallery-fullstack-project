import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onUploadClick, onCreateAlbumClick, onSearchChange }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="logo">📸 Photo Gallery</div>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search images & albums..."
        className="search-bar"
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="nav-buttons">
        <button onClick={onUploadClick}>Upload Pic</button>
        <button onClick={onCreateAlbumClick}>Create Album</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        
       
        
      
      </div>
    </nav>
  );
};

export default Navbar;