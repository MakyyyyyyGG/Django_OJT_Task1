import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditBlog from "../components/EditBlog";
const BlogPreview = () => {
  const navigate = useNavigate(); // Fixed the usage of useNavigate
  const { id } = useParams();
  const [blog, SetBlog] = useState([]);

  const [open, setOpen] = useState(false); // State to manage dialog open/close

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/posts/${id}/`);
      SetBlog(response.data);
      console.log(response.data);
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

  const deleteBlog = async () => {
    try {
      const response = await api.delete(`/api/posts/${id}/delete`);
      console.log("Success:", response.data);
      if (response.status === 204) {
        toast.success("Blog has been deleted", {});
      } else {
        toast.error("Failed to delete blog", {});
      }
      setOpen(false); // Close the dialog on success
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
      navigate("/home"); // Redirect to /home after delete
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-36  w-full h-screen overflow-auto">
      <Toaster />
      <div className="w-54 flex flex-col gap-2">
        <div className="flex justify-between items-center ">
          <h1 className="text-sm">DATE</h1>
          <div className="flex gap-2">
            {/* {blog && <EditBlog blog={blog} updateSuccess={fetchData} />} */}
            {/* <EditBlog blog={blog} /> */}
            {/* <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  type="button"
                  variant="destructive"
                  className=" rounded-none"
                >
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181c] max-w-xl p-4 border  border-[#5a5a5a]">
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this blog?
                  </DialogTitle>
                  <DialogDescription>
                    Once deleted, it cannot be recovered.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className=" flex-1 gap-2 flex">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={deleteBlog}
                      className=" rounded-none"
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                      className=" rounded-none"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>

        <hr />
        <h1 className="text-lg tracking-wider">
          {formatDate(blog.created_date)}
        </h1>
      </div>
      <h1 className="text-7xl font-bold my-8">{blog.title}</h1>

      <div className="grid grid-cols-3 gap-4 my-8">
        {blog.images &&
          blog.images.map((image, index) => (
            <motion.div
              className=""
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <img
                className="object-cover h-64 w-full "
                src={`https://markyyyyyygg.pythonanywhere.com/api${image.image}`}
              />
            </motion.div>
          ))}
      </div>

      {blog.descriptions && blog.descriptions.length > 0 ? (
        blog.descriptions.map((description, index) => (
          <div key={index} className="mb-8 flex  ">
            <div className=" min-w-96">
              <h1 className="font-semibold text-5xl ">Day {index + 1}</h1>
            </div>
            <div className="  flex-grow">
              <p className="text-xl text-justify ">{description.text}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No descriptions available.</p>
      )}
    </div>
  );
};

export default BlogPreview;
