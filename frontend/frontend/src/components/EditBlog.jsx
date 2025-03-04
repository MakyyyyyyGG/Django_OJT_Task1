import React, { useState, useEffect } from "react";
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
import { Trash, ImagePlus, Loader2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

const EditBlog = ({ blog, updateSuccess }) => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // State to manage dialog open/close
  const [existingImages, setExistingImages] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  // Set default values when blog prop changes
  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        descriptions: blog.descriptions || [{ text: "" }],
      });
      setExistingImages(blog.images || []); // Ensure existing images are set
    }
  }, [blog, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  // Initialize with one description field if none exist
  useEffect(() => {
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

  const handleRemoveExistingFile = async (index) => {
    try {
      // Make API call to delete the image
      await api.delete(
        `/api/posts/${blog.id}/delete-image/${existingImages[index].id}/`
      );

      // Update local state to remove the image
      setExistingImages((prevImages) => {
        const remainingImages = prevImages.filter((_, i) => i !== index);
        console.log("Remaining images after delete:", remainingImages);
        return remainingImages;
      });

      // Call updateSuccess to refresh the parent component
      if (updateSuccess) {
        updateSuccess();
      }

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        descriptions: formData.descriptions.map((desc) => ({
          text: desc.text,
        })),
        published_date: null,
        author: 1,
      };

      console.log("updatedData:", updateData);

      const response = await api.put(
        `/api/posts/${blog.id}/delete`,
        updateData
      );

      console.log(response.data);

      // Upload new images if any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        await api.post(`/api/posts/${blog.id}/upload-images/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (updateSuccess) {
        updateSuccess();
      }

      toast.success("Blog updated successfully");
      setOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      toast.error("Failed to update blog");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-none">
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#18181c] max-w-3xl p-4 border  border-[#5a5a5a]">
          <DialogHeader>
            <DialogTitle>Edit a blog</DialogTitle>
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
                {/* Show existing blog images */}
                {existingImages?.map((image, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveExistingFile(index)}
                      className="absolute top-0 right-0 p-3 m-2 rounded-none  bg-red-500 text-white"
                    >
                      <Trash />
                    </Button>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api${image.image}`}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                ))}
                {/* Show newly selected files */}
                {selectedFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
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
                disabled={loading}
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

export default EditBlog;
