import React, { useContext, useState } from "react";
import { EyeClosedIcon, EyeIcon, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import Spinner from "../Loader/Spinner";
import { useShowPassword } from "@/hooks/useShowPassWord";
import { FaLock } from "react-icons/fa";

function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { handleShowPassword, showPassword } = useShowPassword();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password, firstname, lastname, gender, phone, address } = data;
    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstname, lastname, gender, phone, address },
        },
      });

      if (authError) {
        let message = "There was an error creating the user.";
        if (authError.message.includes("already registered")) {
          message = "This email is already registered.";
        }
        toast.error(message, { position: "bottom-center" });
        throw new Error(message);
      }

      const user = authData?.user;
      if (!user?.id) {
        const message = "User creation failed: No user ID returned.";
        toast.error(message, { position: "bottom-center" });
        throw new Error(message);
      }

      // Step 2: Insert user profile into the `users` table
      const userData = {
        email,
        firstname,
        lastname,
        gender: gender || null,
        phone: phone || null,
        address: address || null,
        role: "user", // Default role
        is_active: true, // Default active status
      };

      const { error: profileError } = await supabase
        .from("users")
        .insert([userData]);

      if (profileError) {
        console.error("Supabase users insert error:", profileError);
        const message =
          profileError.message || "There was an error saving user profile.";
        toast.error(message, { position: "bottom-center" });
        throw new Error(message);
      }

      toast.success("User created successfully!", { position: "top-center" });
      navigate("/signin");
      reset();

      if (!authData.session) {
        toast.info("Please check your email to verify your account.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      const message = error.message || "There was an error creating the user.";
      toast.error(message, { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="font-primary mt-14 md:mt-20 py-8 md:py-16 flex justify-center bg-green-200">
      <form
        className="w-full mt-16 bg-white max-w-[330px] md:max-w-2xl lg:max-w-3xl shadow p-7 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-x-10 place-items-center md:place-items-start"
        onSubmit={handleSubmit(onSubmit)}
        aria-label="User registration form"
      >
        {/* Required Information */}
        <div className="w-full space-y-5">
          <h2 className="text-2xl text-primary">Required Information</h2>

          <div className="space-y-1.5">
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="Enter your first name"
              aria-describedby="firstname-error"
              {...register("firstname", {
                required: "First name is required.",
              })}
            />
            {errors.firstname && (
              <p id="firstname-error" className="text-destructive text-sm">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Enter your last name"
              aria-describedby="lastname-error"
              {...register("lastname", {
                required: "Last name is required.",
              })}
            />
            {errors.lastname && (
              <p id="lastname-error" className="text-destructive text-sm">
                {errors.lastname.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              aria-describedby="email-error"
              {...register("email", {
                required: "Please enter a valid email.",
                validate: {
                  notAdmin: (value) =>
                    value !== "admin@example.com" ||
                    "Enter a different email address.",
                  notBlackListed: (value) =>
                    !value.endsWith("baddomain.com") ||
                    "This domain is not supported.",
                },
              })}
            />
            {errors.email && (
              <p id="email-error" className="text-destructive text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="flex justify-between items-center"
            >
              <span className="flex items-center">
                <FaLock className="inline mr-2 text-gray-400" />
                Password
              </span>
              <button
                type="button"
                onClick={handleShowPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosedIcon size={17} /> : <EyeIcon size={17} />}
              </button>
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a password"
              aria-describedby="password-error"
              {...register("password", {
                required: "Please enter a valid password.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
                // pattern: {
                //   value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                //   message: "Password must include a number and a special character.",
                // },
              })}
            />
            {errors.password && (
              <p id="password-error" className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
            <span className="flex items-center mt-1">
              <Info size={16} className="mr-1" aria-hidden="true" />
              <p className="text-xs">
                Password must be 8+ characters long.
              </p>
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              aria-describedby="confirmPassword-error"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match.",
              })}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="w-full space-y-5">
          <h2 className="text-2xl text-primary">Additional Information</h2>

          <div className="space-y-1.5">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              {...register("gender")}
              className="block w-full px-3 py-1 border rounded-md"
              aria-label="Select your gender"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              aria-describedby="phone-error"
              {...register("phone", {
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Please enter a valid phone number.",
                },
              })}
            />
            {errors.phone && (
              <p id="phone-error" className="text-destructive text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your current address"
              aria-label="Enter your address"
              {...register("address")}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="outline"
          disabled={isLoading}
          className="w-full hover:bg-primary hover:text-white col-span-1 md:col-span-2"
          aria-label="Submit registration"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Spinner />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </section>
  );
}

export default Register;