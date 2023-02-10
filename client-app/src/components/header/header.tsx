import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Popover } from "react-tiny-popover";
import { TailSpin } from "react-loader-spinner";
import "./header.css";
import Avatar from "./avatar/avatar";
import AvatarMenu from "./avatarmenu/avatarmenu";
import IconButton from "../iconbutton/iconbutton";
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Login from "../../components/login/login";
import Register from "../../components/register/register";
import { toast } from "react-toastify";

const modalStyles: Modal.Styles = {
  content: {
    width: "400px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
};

function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userStore: { user, isLoggedIn, isLoadingUser, userProfile },
  } = useStore();

  function renderUserStatus() {
    if (isLoadingUser) {
      return (
        <TailSpin
          height="60"
          width="60"
          color="var(--primary-color)"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      );
    } else if (isLoggedIn) {
      return (
        <>
          <IconButton
            label="بنویس"
            icon={<CiEdit />}
            onClick={() => {
              if (userProfile?.isActive) navigate("/new");
              else {
                toast("اکانت شما غیرفعال است", {
                  type: "warning"
                })
              }
            }}
          />
          <Popover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            reposition={false}
            positions={["bottom"]} // preferred positions by priority
            content={<AvatarMenu close={() => setIsPopoverOpen(false)} />}
          >
            <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
              <Avatar />
            </div>
          </Popover>
        </>
      );
    } else {
      return (
        <>
          <span className="underline" onClick={() => setLoginOpen(true)}>
            ورود
          </span>
          <span style={{ margin: "0 0.2rem" }}>/</span>
          <span className="underline" onClick={() => setRegisterOpen(true)}>
            ثبت نام
          </span>
        </>
      );
    }
  }

  useEffect(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
  }, [location, user]);

  return (
    <>
      <header>
        <div className="box"></div>
        <div className="box">
          <h2 onClick={() => navigate("/")} className="title">
            <span>.</span>نقطه سرخط
          </h2>
        </div>
        <div className="box">{renderUserStatus()}</div>
      </header>
      <Modal
        isOpen={isLoginOpen}
        onRequestClose={() => setLoginOpen(false)}
        ariaHideApp={false}
        style={modalStyles}
      >
        <Login closeLogin={() => setLoginOpen(false)} />
      </Modal>
      <Modal
        isOpen={isRegisterOpen}
        onRequestClose={() => setRegisterOpen(false)}
        ariaHideApp={false}
        style={modalStyles}
      >
        <Register closeRegister={() => setRegisterOpen(false)} />
      </Modal>
    </>
  );
}

export default observer(Header);
