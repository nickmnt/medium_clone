import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "./app/stores/store";
import Feed from "./pages/feed/feed.page";
import Write from "./pages/write/write.page";
import Read from "./pages/read/read";
import Search from "./pages/search/search";

function App() {
  const {
    userStore: { getUser },
  } = useStore();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/new" element={<Write />} />
        <Route path="/edit/:id" element={<Write />} />
        <Route path="/read/:id" element={<Read />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Feed />} />
      </Routes>
      <ToastContainer position="top-center" closeOnClick rtl />
    </>
  );
}

export default App;
