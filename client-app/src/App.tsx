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
import Cats from "./pages/cats/cats";
import ProtectedRoute from "./components/router/ProtectedRoute";
import AdminRoute from "./components/router/AdminRoute";

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
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <Write />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Write />
            </ProtectedRoute>
          }
        />
        <Route element={<Layout />}>
          <Route
            path="/profile/:username"
            element={
              <AdminRoute>
                <Prof />
              </AdminRoute>
            }
          />
          <Route
            path="/profile/"
            element={
              <ProtectedRoute>
                <Prof />
              </ProtectedRoute>
            }
          />
          <Route path="/read/:id" element={<Read />} />
          <Route
            path="/myblogs"
            element={
              <ProtectedRoute>
                <MyBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <AdminRoute>
                <Blogs />
              </AdminRoute>
            }
          />
          <Route
            path="/cats"
            element={
              <AdminRoute>
                <Cats />
              </AdminRoute>
            }
          />
          <Route
            path="/authors"
            element={
              <AdminRoute>
                <Authors />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Feed />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" closeOnClick rtl />
    </>
  );
}

export default App;
