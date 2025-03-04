import React, { useEffect, useState } from "react";
import SplitText from "@/components/SplitText";
import { ArrowUpRight } from "lucide-react";
import AddBlog from "@/components/AddBlog";
import api from "@/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const Preview = () => {
  const [blogs, SetBlogs] = useState([]);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/api/posts/");
      console.log(response.data);
      SetBlogs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleString(undefined, options);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 w-full h-screen overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="">Blogs</h1>
          <SplitText
            text="Welcome to my blog!"
            className="text-2xl font-semibold text-center"
            delay={100}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>

        {/* <AddBlog /> */}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 ">
        {blogs.map((blog, index) => (
          <Link to={`/blog-preview/${blog.id}`} key={blog.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5, // Increased duration for smoother animation
                delay: index * 0.2,
                ease: "easeOut", // Changed easing for a smoother finish
              }}
              className="border border-[#3a3a3a] p-4 group  hover:cursor-pointer"
            >
              <div className="flex items-center justify-center ">
                <img
                  className="h-64 w-full object-cover "
                  src={`${import.meta.env.VITE_API_URL}/api${
                    blog.images[0]?.image
                  }`}
                  alt={blog.title}
                />
              </div>

              <div className="flex justify-between mt-4 items-center">
                <div>
                  <h1 className="text-lg relative group ">
                    {blog.title}
                    <span className="block h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
                  </h1>
                  <p>{formatDate(blog.created_date)}</p>
                </div>

                <div className="rounded-full border p-2 transition-colors ease-in-out group-hover:bg-white group-hover:text-black ">
                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:scale-110"
                  />
                </div>
              </div>
              <p className="italic text-sm tracking-wider">{blog.dateRange}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Preview;
