import { supabase } from "@/supabaseClient";
import { useState, useEffect } from "react";

export default function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setError(usersError);
        return;
      }

      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}