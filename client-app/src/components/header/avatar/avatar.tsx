import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import "./avatar.css";

function Avatar() {
  const {
    userStore: { user },
  } = useStore();
  return (
    <img
      className="avatar"
      src={user?.image || "https://i.pravatar.cc/50"}
      alt="user avatar"
    />
  );
}

export default observer(Avatar);
