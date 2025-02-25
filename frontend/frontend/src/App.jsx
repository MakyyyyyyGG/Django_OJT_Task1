import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Sidebar from "./components/Sidebar";
import PageNotFound from "./pages/PageNotFound";
import Blog from "./pages/Blog";

const App = () => {
  return (
    <div className="flex">
      <aside className="w-1/8">
        <Sidebar />
      </aside>
      <main className="flex flex-grow bg-[#18181c] ">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/blog/:id" element={<Blog />} key="blog" />
        </Routes>
      </main>
    </div>
  );
};

export default App;
