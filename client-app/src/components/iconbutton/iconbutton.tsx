import React from "react";
import "./iconbutton.css";

interface Props {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

function IconButton({ label, icon, onClick }: Props) {
  return (
    <div className="btn icon-btn" onClick={onClick}>
      <span>{label}</span>
      {icon}
    </div>
  );
}

export default IconButton;
