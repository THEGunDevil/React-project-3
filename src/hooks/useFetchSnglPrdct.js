import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export const useFetchSnglPrdct = (productid) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productid) return;
      setIsLoading(true);

      try {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productid)
          .single();

        if (productError) {
          console.error(productError);
          setError(productError);
          toast.error(productError.message || "Fetch error", {
            position: "bottom-center",
          });
          return;
        }

        setProduct(productData);
      } catch (error) {
        console.error(error);
        setError(error);
        toast.error("There was an error fetching the data.", {
          position: "bottom-center",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productid]); // ✅ Use productid as dependency

  return { product, setProduct, error, isLoading }; // ✅ Inside function
};
