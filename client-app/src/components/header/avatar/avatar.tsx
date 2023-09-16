import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import "./avatar.css";

function Avatar() {
  const {
    contentStore: { userProfile },
  } = useStore();
  
  return (
    <img
      className="avatar"
      src={
        userProfile?.image
          ? process.env.REACT_APP_IMG_URL + `${userProfile.image}`
          : "https://api.dicebear.com/5.x/thumbs/svg"
      }
      alt="user avatar"
    />
  );
}

export default observer(Avatar);
