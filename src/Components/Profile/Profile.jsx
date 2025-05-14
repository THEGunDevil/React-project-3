import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { UserContext } from "@/Contexts/UserContext";

export default function Profile() {
  const { user, setUser, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        toast.error(`Error signing out: ${error.message}`, {
          position: "bottom-center",
        });
        return;
      }

      // Clear local state and storage
      setUser(null);
      setUserRole(null);
      localStorage.removeItem("user");

      toast.success("Signed out successfully", {
        position: "top-center",
      });
      navigate("/signin");
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      toast.error(`Unexpected error during sign out: ${err.message || err}`, {
        position: "bottom-center",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="mt-14 md:mt-20">
      <Button
        className="mt-10 hover:bg-green-700"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}
