// hooks/useFetchSnglUser.js
import { supabase } from "@/supabaseClient";
import { useState, useEffect } from "react";
export function useFetchSnglUser(email) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single(); 

        if (userError) {
          setError(userError.message);
          setUser(null);
        } else {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  return { user, error, isLoading };
};