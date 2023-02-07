import { observer } from "mobx-react-lite";
import React from "react";
import { CiUser, CiLogout, CiMemoPad } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import "./avatarmenu.css";

function AvatarMenu() {
  const navigate = useNavigate();
  const {
    userStore: { logout },
  } = useStore();

  return (
    <div className="menu">
      <div className="menu-item" onClick={() => navigate("/profile")}>
        <span>پروفایل کاربری</span>
        <CiUser fontSize={24} />
      </div>
      <div className="menu-item" onClick={() => navigate("/myblogs")}>
        <span>نوشته های من</span>
        <CiMemoPad fontSize={24} />
      </div>
      <div
        className="menu-item"
        onClick={() => {
          navigate("/");
          logout();
        }}
      >
        <span>خروج</span>
        <CiLogout fontSize={24} />
      </div>
    </div>
  );
}

export default observer(AvatarMenu);
