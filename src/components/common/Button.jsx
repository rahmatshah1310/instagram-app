import React from "react";

const Button = ({ children, className, onClick }) => {
  return (
    <button className={`hover:cursor-pointer ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
