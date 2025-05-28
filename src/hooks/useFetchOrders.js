import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
export const useFetchOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*");
        if (ordersError) {
          console.error(ordersError);
          setError(ordersError);
          toast.error(ordersError, { position: "bottom-center" });
          throw new Error();
        }

        setOrders(ordersData);
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
    fetchOrdersData();
  }, [setOrders]);
  return { orders, setOrders, error, isLoading };
};
