import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Welcome.css"; // Import CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";
const Welcome = () => {
  return (
    <div className="welcome-page">
      <Container className="text-center">
        <h1 className="display-1 fw-bold text-light welcome-title">Photo Gallery</h1>
        <p className="lead text-light text-center welcome-text">
        Welcome to your personal space of memories and creativity. Our digital gallery is more than just a place to store photos — it's where your best moments come to life. Capture the magic of everyday experiences, organize them into beautiful albums, and share your stories with the world. Whether it's a stunning landscape, a candid smile, or a meaningful moment, every picture holds a piece of you. With powerful features like image tagging, search, and smart album creation, your memories are always just a click away. Let your lens do the talking and turn your life into a living gallery — expressive, inspiring, and uniquely yours.
        </p>
        <div className="mt-4">
          <Button variant="outline-light" as={Link} to="/register" className="me-3 px-4 py-2">Sign Up</Button>
          <Button variant="outline-light " as={Link} to="/login" className="px-4 py-2">Sign In</Button>
        </div>
      </Container>
    </div>
  );
};

export default Welcome;
