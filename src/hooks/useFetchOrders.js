import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";

export const useFetchOrders = (userId = null) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        const query = supabase.from("orders").select("*");

        if (userId) {
          query.eq("user_id", userId);
        }

        const { data: ordersData, error: ordersError } = await query;

        if (ordersError) {
          console.error(ordersError);
          setError(ordersError);
          toast.error("Failed to fetch orders", { position: "bottom-center" });
        } else {
          setOrders(ordersData);
        }
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
  }, [userId]); // Re-fetch when userId changes

  return { orders, setOrders, error, isLoading };
};
