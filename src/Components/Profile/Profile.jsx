import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { UserContext } from "@/Contexts/UserContext";

export default function Profile() {

  const { user } = useContext(UserContext)

  return (
    <div className="mt-14 md:mt-20">
      <h2 className="text-center">{user.email}</h2>
    </div>
  );
}
