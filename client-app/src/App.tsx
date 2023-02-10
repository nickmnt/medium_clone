import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "./app/stores/store";
import Feed from "./pages/feed/feed.page";
import Write from "./pages/write/write.page";
import Read from "./pages/read/read";
import MyBlogs from "./pages/myblogs/myblogs";
import Layout from "./layout/layout";
import Prof from "./pages/prof/prof";
import Blogs from "./pages/blogs/blogs";
import Authors from "./pages/authors/authors";

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
        <Route element={<Layout />}>
          <Route path="/profile/:username" element={<Prof />} />
          <Route path="/profile/" element={<Prof />} />
          <Route path="/read/:id" element={<Read />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/" element={<Feed />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" closeOnClick rtl />
    </>
  );
}

export default App;
