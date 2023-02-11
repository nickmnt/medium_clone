import { observer } from "mobx-react-lite";
import React from "react";
import {
  CiUser,
  CiLogout,
  CiMemoPad,
  CiViewList,
  CiHashtag,
  CiPen,
} from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import "./avatarmenu.css";

interface Props {
  close: () => void;
}

function AvatarMenu({ close }: Props) {
  const navigate = useNavigate();
  const {
    userStore: { roles, logout },
  } = useStore();

  function go(path: string) {
    close();
    navigate(path);
  }

  return (
    <div className="menu">
      <div className="menu-item" onClick={() => go("/profile")}>
        <span>پروفایل کاربری</span>
        <CiUser fontSize={24} />
      </div>
      <div className="menu-item" onClick={() => go("/myblogs")}>
        <span>نوشته های من</span>
        <CiMemoPad fontSize={24} />
      </div>
      {roles?.includes("Admin") ? (
        <>
          <div className="menu-item" onClick={() => go("/blogs")}>
            <span>مدیریت مقالات</span>
            <CiViewList fontSize={24} />
          </div>
          <div className="menu-item" onClick={() => go("/cats")}>
            <span>دسته بندی ها</span>
            <CiHashtag fontSize={24} />
          </div>{" "}
          <div className="menu-item" onClick={() => go("/authors")}>
            <span>نویسندگان</span>
            <CiPen fontSize={24} />
          </div>
        </>
      ) : null}
      <div
        className="menu-item"
        onClick={() => {
          close();
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
