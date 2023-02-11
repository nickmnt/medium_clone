import { observer } from "mobx-react-lite";
import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../app/stores/store";

export interface Props {
  children: any;
}

export default observer(function AdminRoute({ children }: Props) {
  const {
    userStore: { user, roles },
  } = useStore();

  if (!user || !roles.includes("Admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
});
