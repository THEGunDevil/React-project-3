import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import Spinner from "../Loader/Spinner";
export default function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const thumbnail = watch("thumbnail");
  const images = watch("images");

  // Generate thumbnail preview
  useEffect(() => {
    if (thumbnail && thumbnail[0]) {
      setThumbnailPreview(URL.createObjectURL(thumbnail[0]));
    } else {
      setThumbnailPreview(null);
    }
  }, [thumbnail]);

  // Generate images previews
  useEffect(() => {
    if (images) {
      const filesArray = Array.from(images);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImagesPreview(previewUrls);
    } else {
      setImagesPreview([]);
    }
  }, [images]);

  // Cleanup object URLs when previews change or component unmounts
  useEffect(() => {
    return () => {
      imagesPreview.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [imagesPreview, thumbnailPreview]);

  const onSubmit = async (formData) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be signed in to add a product.", {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Upload thumbnail
      const thumbnailFile = formData.thumbnail[0];
      const thumbPath = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
      const { error: thumbError } = await supabase.storage
        .from("products")
        .upload(thumbPath, thumbnailFile);
      if (thumbError) {
        console.error("Thumbnail upload error:", thumbError);
        if (thumbError.status === 403) {
          toast.error("Permission denied: Unable to upload thumbnail.", {
            position: "bottom-center",
          });
        } else {
          toast.error(`Error uploading thumbnail: ${thumbError.message}`, {
            position: "bottom-center",
          });
        }
        return;
      }
      const { data: thumbUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(thumbPath);

      // Upload product images in parallel
      const imageFiles = Array.from(formData.images || []);
      const imageUploads = imageFiles.map(async (file) => {
        const imgPath = `images/${Date.now()}-${file.name}`;
        const { error: imgErr } = await supabase.storage
          .from("products")
          .upload(imgPath, file);
        if (imgErr) throw imgErr;
        const { data: imgUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(imgPath);
        return imgUrlData.publicUrl;
      });
      let imageUrls;
      try {
        imageUrls = await Promise.all(imageUploads);
      } catch (imgError) {
        console.error("Image upload error:", imgError);
        if (imgError.status === 403) {
          toast.error("Permission denied: Unable to upload product images.", {
            position: "bottom-center",
          });
        } else {
          toast.error(`Error uploading images: ${imgError.message}`, {
            position: "bottom-center",
          });
        }
        return;
      }

      // Construct product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock, 10),
        brand: formData.brand,
        category: formData.category,
        thumbnail: thumbUrlData.publicUrl,
        images: imageUrls,
      };

      // Insert into database
      const { error: insertError } = await supabase
        .from("products")
        .insert([productData]);
      if (insertError) {
        console.error("Database insert error:", insertError);
        if (insertError.code === "42501") {
          toast.error("Permission denied: Unable to add product to database.", {
            position: "bottom-center",
          });
        } else {
          toast.error(`Error adding product: ${insertError.message}`, {
            position: "bottom-center",
          });
        }
        return;
      }

      // Success
      toast.success("Product added successfully!", { position: "top-center" });
      reset();
      setImagesPreview([]);
      setThumbnailPreview(null);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto ">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:space-y-7 space-y-4 "
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Product title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-destructive text-[13px] mt-1">
              {errors.title.message}
            </p>
          )}

        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Product description"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border rounded p-2"
          />
          {errors.description && (
            <p className="text-destructive text-[13px] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price, Discount, Stock */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "price", label: "Price", type: "number" },
            { name: "discount", label: "Discount %", type: "number" },
            { name: "stock", label: "Stock", type: "number" },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={`Product ${field.label.toLowerCase()}`}
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
              />
              {errors[field.name] && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Brand & Category */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "brand", label: "Brand", type: "text" },
            {
              name: "category",
              label: "Category",
              type: "text",
              required: true,
            },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={`Product ${field.label.toLowerCase()}`}
                {...register(field.name, {
                  required: field.required && `${field.label} is required`,
                })}
              />
              {errors[field.name] && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail Upload & Preview */}
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: "Thumbnail is required" })}
          />
          {errors.thumbnail && (
            <p className="text-destructive text-[13px] mt-1">
              {errors.thumbnail.message}
            </p>
          )}
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="thumb-preview"
              className="h-16 w-16 object-cover rounded"
            />
          )}
        </div>

        {/* Images Upload & Preview */}
        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
          />
          {imagesPreview.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imagesPreview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="h-16 w-16 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="px-4 py-2 text-white rounded hover:bg-green-400 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Spinner /> Adding Product...
            </span>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </section>
  );
}
