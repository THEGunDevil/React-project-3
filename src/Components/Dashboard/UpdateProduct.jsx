import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Spinner from "../Loader/Spinner";
import { Info } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useFetchSnglPrdct } from "@/hooks/useFetchSnglPrdct";

export default function UpdateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingProduct, setExistingProduct] = useState(null);
  const [productIdToUpdate, setProductIdToUpdate] = useState(null);

  const thumbnailFiles = watch("thumbnail");
  const imageFiles = watch("images");
  const productId = watch("id");

  const {
    product: existingProductData,
    error: existingProductError,
    isLoading: existingProductLoading,
  } = useFetchSnglPrdct(productId);

  const onIdSubmit = () => {
    if (!productId) {
      toast.error("Please enter a Product ID to load.", {
        position: "bottom-center",
      });
      return;
    }

    if (existingProductLoading) return;

    if (existingProductError || !existingProductData) {
      toast.error("Product not found.", { position: "bottom-center" });
      return;
    }

    setExistingProduct(existingProductData);
    setProductIdToUpdate(productId);
    reset({
      title: existingProductData.title || "",
      description: existingProductData.description || "",
      price: existingProductData.price || "",
      discount: existingProductData.discount || "",
      stock: existingProductData.stock || "",
      brand: existingProductData.brand || "",
      category: existingProductData.category || "",
    });
    setThumbnailPreview(existingProductData.thumbnail);
    setImagesPreview(existingProductData.images || []);
  };

  useEffect(() => {
    if (thumbnailFiles && thumbnailFiles[0]) {
      const url = URL.createObjectURL(thumbnailFiles[0]);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFiles]);

  useEffect(() => {
    if (imageFiles) {
      const arr = Array.from(imageFiles);
      const urls = arr.map((f) => URL.createObjectURL(f));
      setImagesPreview(urls);
      return () => urls.forEach(URL.revokeObjectURL);
    }
  }, [imageFiles]);

  const onSubmit = async (formData) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be signed in.", { position: "bottom-center" });
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        discount: formData.discount,
        stock: formData.stock,
        brand: formData.brand,
        category: formData.category,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productIdToUpdate);

      if (error) throw error;

      toast.success("Product updated successfully!", {
        position: "top-center",
      });
      reset();
      setExistingProduct(null);
      setThumbnailPreview(null);
      setImagesPreview([]);
    } catch (err) {
      console.error(err);
      toast.error("Update failed.", { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="relative max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Update Product</h2>
        {!existingProduct && (
          <form
            onSubmit={handleSubmit(onIdSubmit)}
            className="md:space-y-5 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="id" className="text-primary text-lg">
                Product Id
              </Label>
              <Input
                id="id"
                type="text"
                placeholder="Enter Product ID"
                {...register("id")}
              />
              {errors.id && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors.id.message}
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-1 text-[13px] mt-1">
                <Info size={13} />
                NOTE: Product id is needed to upgrade the product information.
              </p>
            </div>
            <Button type="submit" disabled={isLoading || !productId} className="hover:bg-green-400 cursor-pointer">
              Load Product
            </Button>
          </form>
        )}{" "}
        {existingProduct && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:space-y-7 space-y-4 "
          >
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Product title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">
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
                {...register("description")}
                className="w-full border rounded p-2"
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
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
                    {...register(field.name)}
                  />
                  {errors[field.name] && (
                    <p className="text-destructive text-sm mt-1">
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
                },
              ].map((field) => (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={`Product ${field.label.toLowerCase()}`}
                    {...register(field.name)}
                  />
                  {errors[field.name] && (
                    <p className="text-destructive text-sm mt-1">
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
                {...register("thumbnail")}
              />
              {errors.thumbnail && (
                <p className="text-destructive text-sm mt-1">
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
            <Button
              type="submit"
              disabled={!isDirty || isLoading}
              className="px-4 py-2 text-white rounded hover:bg-green-400"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Spinner /> Updating Product...
                </span>
              ) : (
                "Update Product"
              )}
            </Button>
          </form>
        )}
      </section>
    </>
  );
}
