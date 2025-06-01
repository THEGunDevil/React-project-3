import React, { useContext } from "react";
import { Button } from "../ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { UserContext } from "@/Contexts/UserContext";
import { useNavigate } from "react-router-dom";
function Setting() {
    const { user, setUser } = useContext(UserContext);
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
    <section className="mt-14 md:mt-20">
      <Button className="mt-10 hover:bg-green-400 cursor-pointer" onClick={handleSignOut}>
        <FaSignOutAlt />
        Sign Out
      </Button>
    </section>
  );
}

export default Setting;
