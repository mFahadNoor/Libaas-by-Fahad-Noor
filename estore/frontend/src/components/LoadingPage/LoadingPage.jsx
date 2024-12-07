import React from "react";
import "./LoadingPage.css"; // Import CSS for styling the animation
import Navbar from "../Navbarwithoutsb";

const LoadingScreen = () => {
  return (
    <div>
      <Navbar/>
    <div className=" flex justify-center items-center h-screen overflow-hidden loading-overlay">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
    </div>
  );
};

export default LoadingScreen;
