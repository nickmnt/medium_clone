import { observer } from "mobx-react-lite";
import React from "react";
import Header from "../../components/header/header";

function Search() {
  return (
    <>
      <Header />
      <div className="container">
        search
      </div>
    </>
  );
}

export default observer(Search);
