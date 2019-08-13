import React from "react";
import { Link } from 'gatsby'

const cont = {
  backgroundColor: "#eee",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative"
};

const ImageRenderer = ({
  photo,
  margin
}) => {
  
  console.log("TCL: photo", photo)

  return (
    <Link to={photo.slug}>
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont }}
      >
      <img
        alt={photo.title}
        {...photo}
        
        />
      <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style>
    </div>
    </Link>
  );
};

export default ImageRenderer;
