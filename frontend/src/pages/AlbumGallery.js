import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AlbumGallery.css";
import { Button, Modal } from "react-bootstrap";
import { FaTrash, FaHeart, FaBookmark } from "react-icons/fa";  // Import icons

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

function AlbumGallery({ userId, searchQuery }) {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Fetch Albums with Optimization
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!userId || albums.length > 0) return; // Prevent redundant API calls
      try {
        const response = await axios.get(`${API_BASE_URL}/api/albums?userId=${userId}`);
        setAlbums(response.data.albums || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };
    fetchAlbums();
  }, [userId, albums.length]);

  // ✅ Optimized Filtering of Albums & Images Based on Search Query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAlbums(albums);
      return;
    }
    const query = searchQuery.toLowerCase();
  
    setFilteredAlbums(
      albums
        .map((album) => ({
          ...album,
          images: album.images.filter(
            (image) =>
              image.toLowerCase().includes(query) ||
              (album.tags && album.tags.some((tag) => tag.toLowerCase().includes(query)))
          ),
        }))
        .filter(
          (album) =>
            album.albumName.toLowerCase().includes(query) || // ✅ Ensuring albumName is checked
            album.description.toLowerCase().includes(query) || // ✅ Checking description
            album.tags?.some((tag) => tag.toLowerCase().includes(query)) || // ✅ Checking tags
            album.images.length > 0
        )
    );
  }, [searchQuery, albums]);
  
  // ✅ Open Album Modal
  const openModal = (album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  // ✅ Close Album Modal
  const closeModal = () => setSelectedAlbum(null);

  // ✅ Handle Image Upload with Error Handling
  const handleImageUpload = async (event) => {
    if (!selectedAlbum) return;
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("albumId", selectedAlbum._id);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/albums/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const newImagePath = response.data.imagePath;
        setSelectedAlbum((prev) => ({ ...prev, images: [...prev.images, newImagePath] }));
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album._id === selectedAlbum._id ? { ...album, images: [...album.images, newImagePath] } : album
          )
        );
      } else {
        alert("Upload failed: " + response.data.message);
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
    }
  };

  // ✅ Handle Image Deletion with Navigation Fix
  const handleDeleteImage = async () => {
    if (!selectedAlbum) return;
    const imageName = selectedAlbum.images[currentImageIndex];

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/albums/deleteImage`, {
        data: { albumId: selectedAlbum._id, imageName },
      });

      if (response.data.success) {
        const updatedImages = selectedAlbum.images.filter((img) => img !== imageName);
        setSelectedAlbum((prev) => ({ ...prev, images: updatedImages }));
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album._id === selectedAlbum._id ? { ...album, images: updatedImages } : album
          )
        );
        if (updatedImages.length === 0) closeModal();
        else setCurrentImageIndex(0);
      } else {
        alert("Delete failed: " + response.data.message);
      }
    } catch (error) {
      alert("Error deleting image: " + error.message);
    }
  };
  const handleSaveAlbum = async (albumId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/albums/save`, { userId, albumId });
      alert("Album saved successfully!");
    } catch (error) {
      alert("Error saving album");
    }
  };

  const handleFavoriteAlbum = async (albumId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/albums/favorite`, { userId, albumId });
      alert("Album added to favorites!");
    } catch (error) {
      alert("Error favoriting album");
    }
  };

  // Handle Delete Album
  const handleDeleteAlbum = async (albumId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/albums/delete`, { data: { albumId } });
      setAlbums(albums.filter((album) => album._id !== albumId));
      setFilteredAlbums(filteredAlbums.filter((album) => album._id !== albumId));
      alert("Album deleted successfully!");
    } catch (error) {
      alert("Error deleting album");
    }
  };

  
  return (
    <div className="album-gallery">
      <h2>Photo Albums</h2>
      <div className="album-list">
        {filteredAlbums.map((album) => (
          <div key={album._id} className="album-card">
            <img src={`${API_BASE_URL}/uploads/${album.coverImage}`} alt={album.albumName} className="album-cover" />
            <h4>Name:-{album.albumName}</h4>
            <p>Description:-{album.description}</p>
            <p>Tags:-{album.tags ? album.tags.join(", ") : "No tags"}</p>
            <Button className="button1" onClick={() => openModal(album)}>View</Button>
            <div className="album-icons">
              <FaBookmark onClick={() => handleSaveAlbum(album._id)} />
              <FaHeart onClick={() => handleFavoriteAlbum(album._id)} />
              <FaTrash onClick={() => handleDeleteAlbum(album._id)} />
            </div>
          </div>
        ))}
      </div>

      <Modal show={!!selectedAlbum} onHide={closeModal} centered >
        <Modal.Header closeButton >
          <Modal.Title>{selectedAlbum?.albumName}</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          {selectedAlbum?.images.length ? (
            <div className="image-container">
              <Button className="button1" onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? selectedAlbum.images.length - 1 : prev - 1))}>
                &#8249;
              </Button>
              <img
                src={`${API_BASE_URL}/uploads/${selectedAlbum.images[currentImageIndex]}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="modal-image"
              />
              <p>{currentImageIndex + 1} / {selectedAlbum.images.length}</p>
              <Button className="button1"onClick={() => setCurrentImageIndex((prev) => (prev === selectedAlbum.images.length - 1 ? 0 : prev + 1))}>
                &#8250;
              </Button>
            </div>
          ) : (<p>No images available.</p>)}
        </Modal.Body>
        <Modal.Footer>
          <input id="fileInput" type="file" onChange={handleImageUpload} style={{ display: "none" }} />
          <Button className="button1" onClick={() => document.getElementById("fileInput").click()}>Add Image</Button>
          {selectedAlbum?.images.length > 0 && <Button className="button1" onClick={handleDeleteImage}>Delete Image</Button>}
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AlbumGallery;