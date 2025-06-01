import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import Spinner from "../Loader/Spinner";
import { FaEnvelope, FaGithub, FaGoogle } from "react-icons/fa";
import { UserContext } from "@/Contexts/UserContext";
import { FaLock } from "react-icons/fa6";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useShowPassword } from "@/hooks/useShowPassWord";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { handleShowPassword, isPassword } = useShowPassword();
  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        let msg = "An error occurred during sign-in.";
        if (authError.message.includes("Invalid login credentials")) {
          msg = "Invalid email or password.";
        } else if (authError.message.includes("network")) {
          msg = "Network error. Please check your connection.";
        }
        throw new Error(msg);
      }

      const userAuth = authData.user;

      const { data: userRes, error: userError } = await supabase
        .from("users")
        .select("is_active, role, firstname, lastname")
        .eq("id", userAuth.id)
        .single();

      if (userError) {
        throw new Error("Failed to verify user status.");
      }

      if (!userRes.is_active) {
        await supabase.auth.signOut();
        setUser(null);
        toast.error("Your account has been banned.", {
          position: "top-center",
        });
        return;
      }

      setUser({
        id: userAuth.id,
        email: userAuth.email,
        role: userRes.role || "user",
        userName: `${userRes.firstname} ${userRes.lastname}`
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userAuth.id,
          email: userAuth.email,
          role: userRes.role || "user",
          userName: `${userRes.firstname} ${userRes.lastname}`
        })
      );


      toast.success("Signed in successfully!", { position: "top-center" });
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Unexpected error.", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const handleOAuthSignIn = async (provider) => {
  //   setIsLoading(true);
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({ provider });
  //     if (error) throw error;
  //   } catch (err) {
  //     toast.error(err.message || `Failed to sign in with ${provider}.`, {
  //       position: "bottom-center",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <section className="flex p-6 justify-center font-primary py-16 mt-14 md:mt-20 bg-green-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:max-w-md md:p-8 p-6 bg-white shadow-md rounded-lg space-y-6"
        aria-label="Sign in form"
      >
        <h1 className="text-center text-3xl font-bold text-primary">Sign In</h1>
        <p className="text-center -mt-3">Welcome back!</p>
        <div className="space-y-2">
          <Label htmlFor="email">
            <span className="flex items-center">
              <FaEnvelope
                className="inline mr-2 text-gray-400"
                aria-hidden="true"
              />
              Email
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-describedby="email-error"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Enter a valid email.",
              },
              validate: {
                notReserved: (v) =>
                  v !== "admin@example.com" || "This email is reserved.",
                validDomain: (v) =>
                  !v.endsWith("baddomain.com") || "Domain not supported.",
              },
            })}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="flex justify-between items-center"
          >
            <span className="flex items-center">
              <FaLock
                className="inline mr-2 text-gray-400"
                aria-hidden="true"
              />
              Password
            </span>
            <button
              type="button"
              onClick={handleShowPassword}
              aria-label={isPassword ? "Hide password" : "Show password"}
            >
              {isPassword ? <EyeClosedIcon size={17} /> : <EyeIcon size={17} />}
            </button>
          </Label>
          <Input
            id="password"
            type={isPassword ? "text" : "password"}
            placeholder="Your password"
            aria-describedby="password-error"
            {...register("password", { required: "Password is required." })}
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center hover:bg-green-700 cursor-pointer"
          aria-label="Sign in"
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
        <div className="flex md:flex-row flex-col justify-between text-nowrap text-[13px] -mt-3">
          <p>
            <Link
              className="hover:text-blue-500 hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link
              className="hover:text-blue-500 hover:underline"
              to="/register"
            >
              Register
            </Link>
          </p>
        </div>
        <div className="flex justify-between space-x-2 text-sm">
          <button
            type="button"
            className="flex items-center gap-1 justify-center w-full shadow p-2 hover:text-primary rounded-md hover:bg-gray-200 cursor-pointer"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            aria-label="Sign in with Google"
          >
            <FaGoogle aria-hidden="true" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center gap-1 justify-center w-full shadow p-2 hover:text-primary rounded-md hover:bg-gray-200 cursor-pointer"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            aria-label="Sign in with GitHub"
          >
            <FaGithub aria-hidden="true" />
            GitHub
          </button>
        </div>
      </form>
    </section>
  );
}
