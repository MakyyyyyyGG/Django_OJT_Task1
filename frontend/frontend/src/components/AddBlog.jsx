import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Toaster, toast } from "./ui/sonner"; // Ensure toast is imported correctly
import { Trash, ImagePlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

const AddBlog = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // State to manage dialog open/close
  const {
    register,
    handleSubmit,
    control,
    reset, // Added reset to clear form inputs
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  // Initialize with one description field
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ text: "" });
    }
  }, [append, fields.length]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // First create the blog post
      const postData = {
        title: data.title,
        descriptions: data.descriptions,
        author: 1,
      };

      console.log("Post Data:", postData);
      const response = await api.post("/api/posts/create/", postData);

      if (response.status === 201) {
        // If there are selected files, upload them
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("images", file);
          });

          // // Log the files being uploaded
          // console.log("Files to upload:");
          // for (let file of selectedFiles) {
          //   console.log("File:", file);
          // }

          try {
            await api.post(
              `/api/posts/${response.data.id}/upload-images/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Images uploaded successfully!");
          } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
          }
        }

        toast.success("Blog has been created");
        setOpen(false);
        reset();
        setSelectedFiles([]);
        navigate(`/blog/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster /> {/* Add Toaster component to render toasts */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-none">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#18181c] max-w-3xl p-4 border  border-[#5a5a5a]">
          <DialogHeader>
            <DialogTitle>Add a blog</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Fill in the details below to add a new blog.
          </DialogDescription>
          <ScrollArea className="max-h-[600px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-4"
            >
              <Label htmlFor="title">Title</Label>
              <Input
                required
                id="title"
                className="bg-transparent rounded-none"
                placeholder="Title"
                {...register("title", { required: true })}
              />
              <div className="flex justify-between items-center">
                <Label htmlFor="descriptions">
                  Day Descriptions (at least 1)
                </Label>
                <Button
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => append({ text: "" })}
                  className="mt-2 rounded-none"
                >
                  <Plus />
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col">
                  <Textarea
                    id={`descriptions.${index}.text`}
                    className="bg-transparent rounded-none"
                    placeholder={`Description for Day ${index + 1}`}
                    {...register(`descriptions.${index}.text`, {
                      required: true,
                    })}
                  />
                  {index > 0 && (
                    <Button
                      size="icon"
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      className="mt-2 rounded-none"
                    >
                      <Trash />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex flex-col">
                <Label
                  htmlFor="upload-button"
                  className="text-lg font-semibold"
                >
                  Attach image/s
                </Label>
                <span className="text-sm text-gray-500">
                  First image will be the cover
                </span>
              </div>
              <Button
                className="rounded-none"
                id="upload-button"
                type="button"
                onClick={handleUploadClick}
                size="icon"
                variant="secondary"
              >
                <ImagePlus size={20} />
              </Button>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                multiple
              />
              <div className="grid grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 p-3 m-2 rounded-none  bg-red-500 text-white"
                    >
                      <Trash />
                    </Button>

                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="rounded-none"
                disabled={loading} // Disable button if loading
              >
                {loading && <Loader2 className="animate-spin" />}
                Submit
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBlog;
