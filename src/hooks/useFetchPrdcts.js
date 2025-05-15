import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
export const useFetchPrdcts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProductsData = async () => {
      setIsLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");
        if (productsError) {
          console.error(productsError);
          setError(productsError);
          toast.error(productsError, { position: "bottom-center" });
          throw new Error();
        }

        setProducts(productsData);
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
    fetchProductsData();
  }, [setProducts]);
  return { products, setProducts, error, isLoading };
};
