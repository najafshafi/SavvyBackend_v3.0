import React from "react";
import "./MyButton.css";

const MyButton = ({ title, icon, outline, disabled, onClick }) => {
  return (
    <button
      className={"buttons"}
      onClick={onClick}
      disabled={disabled}
    >
      {/* {icon && <span className="icon">{icon}</span>} */}
      {title}
    </button>
  );
};

export default MyButton;
