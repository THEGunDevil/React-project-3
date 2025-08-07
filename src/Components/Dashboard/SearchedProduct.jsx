import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Fallback from "../Loader/Fallback";
import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/supabaseClient";
import { DeleteConfirmPopUp } from "../DeleteConfirmPopUp";
import SearchBox from "./SearchBox";

export default function SearchedProduct() {
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    watch,
  } = useForm();
  const searchedId = watch("id");

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
      <SearchBox
        inputType="id"
        setSearchedData={setSearchedProduct}
        fetchFrom="products"
        column="id"
        operator="eq"
        singleFetch={true}
        searchedTo="Fetch"
        loading={loading}
        setLoading={setLoading}
        label="Product Id"
        header="Search Products"
      />

      {loading ? (
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
