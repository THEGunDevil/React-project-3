import React, { useContext } from "react";
import { Button } from "../ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { UserContext } from "@/Contexts/UserContext";
function Setting() {
  const { user, setUser } = useContext(UserContext);
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You've signed out successfully!", {
        position: "top-center",
      });
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error(error, "There was an issue signing out.");
      toast.error("There was an issue signing out.", {
        position: "bottom-center",
      });
    }
  };
  return (
    <Button onClick={handleSignOut}>
      <FaSignOutAlt />
      Sign Out
    </Button>
  );
}

export default Setting;
