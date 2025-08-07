import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Spinner from "../Loader/Spinner";
import { supabase } from "@/supabaseClient";
import Fallback from "../Loader/Fallback";
import SearchBox from "./SearchBox";
import { Card } from "../ui/card";

export default function UpdateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      discount: "",
      stock: "",
      brand: "",
      category: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [productIdToUpdate, setProductIdToUpdate] = useState(null);
  const [productState, setProductState] = useState({
    loading: false,
    error: null,
  });
  const [existingProductData, setExistingProductData] = useState(null);
  const thumbnailFiles = watch("thumbnail");
  const imageFiles = watch("images");

  useEffect(() => {
    if (existingProductData) {
      const p = existingProductData;
      reset({
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        discount: p.discount || "",
        stock: p.stock || "",
        brand: p.brand || "",
        category: p.category || "",
      });
      setProductIdToUpdate(p.id);
      setThumbnailPreview(p.thumbnail || null);
      setImagesPreview(p.images || []);
    }
  }, [existingProductData, reset]); // ✅ watches actual productData

  useEffect(() => {
    if (productState.error) {
      toast.error("Product not found.", { position: "bottom-center" });
    }
  }, [productState.error]);

  useEffect(() => {
    if (thumbnailFiles && thumbnailFiles[0]) {
      const url = URL.createObjectURL(thumbnailFiles[0]);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFiles]);

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const arr = Array.from(imageFiles);
      const urls = arr.map((f) => URL.createObjectURL(f));
      setImagesPreview(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
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
      setProductIdToUpdate(null);
      setProductState({ data: null, loading: false, error: null });
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
      <SearchBox
        inputType="id"
        label="Product Id"
        header="Update Product"
        fetchFrom="products"
        singleFetch={true}
        column="id"
        operator="eq"
        searchedTo="Fetch"
        setSearchedData={setExistingProductData}
        setLoading={setIsLoading}
        loading={productState.loading}
      />

      {productState.loading ? (
        <Fallback />
      ) : (
        existingProductData && (
          <Card>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="md:space-y-7 space-y-4 py-6 mx-auto"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full border rounded p-2"
                />
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {["price", "discount", "stock"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      {...register(field, {
                        required: `${field} is required`,
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: `${field} cannot be negative`,
                        },
                        ...(field === "discount" && {
                          max: {
                            value: 100,
                            message: "Discount cannot exceed 100%",
                          },
                        }),
                      })}
                    />
                    {errors[field] && (
                      <p className="text-destructive text-sm mt-1">
                        {errors[field].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["brand", "category"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      type="text"
                      {...register(field, {
                        required: `${field} is required`,
                      })}
                    />
                    {errors[field] && (
                      <p className="text-destructive text-sm mt-1">
                        {errors[field].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  {...register("thumbnail")}
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("images")}
                />
                {imagesPreview.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {imagesPreview.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Preview ${idx}`}
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
          </Card>
        )
      )}
    </>
  );
}
