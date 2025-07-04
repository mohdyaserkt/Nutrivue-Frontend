import React from "react";
import "./Spinner.css";

export const Spinner = ({ size = "medium" }) => {
  // size can be "small", "medium", or "large"
  const sizeClass = {
    small: "spinner--small",
    medium: "spinner--medium",
    large: "spinner--large",
  }[size];

  return (
    <div className={`spinner ${sizeClass}`} role="status" aria-label="Loading ">
      <div className="spinner__circle"></div>
    </div>
  );
};
