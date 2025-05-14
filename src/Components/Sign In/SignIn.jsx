import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import Spinner from "../Loader/Spinner";
import { UserContext } from "@/Contexts/UserContext";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const navigate = useNavigate();
  const { setUser, setUserRole } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const msg = authError.message.includes("Invalid login credentials")
          ? "Invalid email or password."
          : authError.message;
        throw new Error(msg);
      }

      const user = authData.user;
      setUser(user);

      // Fetch user role
      const { data: roleRes, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        console.warn("Role fetch error:", roleError);
        setUserRole(null);
        toast.warn("Could not fetch user role.", { position: "bottom-center" });
      } else {
        setUserRole(roleRes.role);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: user.id, email: user.email, role: roleRes.role })
        );
      }

      toast.success("Signed in successfully!", { position: "top-center" });
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Unexpected error.", { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg space-y-6"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required.",
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email." },
              validate: {
                notReserved: v => v !== "admin@example.com" || "This email is reserved.",
                validDomain: v => !v.endsWith("baddomain.com") || "Domain not supported.",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            {...register("password", { required: "Password is required." })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </section>
  );
}
