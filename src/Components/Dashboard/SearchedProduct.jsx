import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Fallback from "../Loader/Fallback";
import { useState } from "react";
import { useFetchSnglPrdct } from "@/hooks/useFetchSnglPrdct";
import { Edit2, Info, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { supabase } from "@/supabaseClient";
import { DeleteConfirmPopUp } from "../DeleteConfirmPopUp";

export default function SearchedProduct() {
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm();
  const searchedId = watch("id");

  const {
    product,
    error: productError,
    isLoading,
  } = useFetchSnglPrdct(searchedId);

  // Fetch product
  const fetchProduct = (e) => {
    if (product) {
      setSearchedProduct(product);
      console.log("Fetched product:", product);
    } else if (productError) {
      console.error("Error fetching product:", productError);
    } else {
      console.warn("No product found with this ID.");
    }
  };

  // Delete Product
  const confirmDelete = async () => {
    if (inputValue === "Confirm Delete") {
      try {
        const { error: deleteError } = await supabase
          .from("products")
          .delete()
          .eq("id", searchedId);
        if (deleteError) {
          console.error("Failed to delete:", deleteError);
          setErrorMessage("Failed to delete the product. Please try again.");
        } else {
          console.log("Product deleted successfully!");
          setSearchedProduct(null);
          setDeletePopUp(false);
          setInputValue(""); // clear input after deletion
          setErrorMessage("");
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } else {
      setErrorMessage("You must type 'Confirm Delete' exactly to proceed.");
    }
  };

  const cancelDelete = () => {
    setDeletePopUp(false);
    setInputValue(""); // clear input on cancel
    setErrorMessage("");
  };

  return (
    <>
      <Card>
        <CardContent className="w-xl max-w-xl mx-auto p-5">
          <h2 className="text-2xl font-bold mb-4">Search Product</h2>
          <form
            onSubmit={handleSubmit(fetchProduct)}
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
                {...register("id", { required: "Product ID is required" })}
              />
              {errors.id && (
                <p className="text-destructive text-[13px] mt-1">
                  {errors.id.message}
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-1 text-[13px] mt-1">
                <Info size={13} />
                NOTE: Product id is needed to search a product’s information.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchedId}
              className="hover:bg-green-400 cursor-pointer"
            >
              Load Product
            </Button>
          </form>
          {productError && (
            <p className="mt-2 text-destructive">
              There was an error fetching the product.
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Fallback />
      ) : searchedProduct ? (
        <Card className="mt-6 p-5 rounded-2xl shadow-md overflow-hidden mx-auto flex flex-row justify-center">
          <div>
            <img
              src={searchedProduct.thumbnail}
              alt={searchedProduct.title}
              className="w-2xl h-2xl object-cover"
            />
          </div>

          <div>
            <CardContent className="w-xl max-w-xl">
              <CardHeader className="p-0 mb-2 flex justify-between flex-row items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {searchedProduct.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {searchedProduct.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    className="hover:text-destructive cursor-pointer"
                    variant="outline"
                    onClick={() => setDeletePopUp(true)}
                  >
                    <Trash2 size={20} />
                  </Button>
                  <Button
                    className="hover:text-green-400 cursor-pointer"
                    variant="outline"
                  >
                    <Edit2 size={20} />
                  </Button>
                </div>
              </CardHeader>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t">
              <span className="text-lg font-bold">
                ${searchedProduct.price}
              </span>
              <Button className="hover:bg-green-400 cursor-pointer">
                View Product
              </Button>
            </CardFooter>
          </div>
        </Card>
      ) : null}

      {deletePopUp && (
        <section className="absolute z-50 top-1/2 left-1/2 -translate-1/2 flex w-screen h-screen justify-center items-center">
          <DeleteConfirmPopUp
            deletePopUp={deletePopUp}
            cancelDelete={cancelDelete}
            confirmDelete={confirmDelete}
            inputValue={inputValue}
            setInputValue={setInputValue}
            errorMessage={errorMessage}
          />
        </section>
      )}
    </>
  );
}
