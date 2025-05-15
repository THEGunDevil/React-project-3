import React, { useContext, useState } from "react";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Spinner from "../Loader/Spinner";
import { UserContext } from "@/Contexts/UserContext";
function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password, firstname, lastname, gender, phone, address } =
      data;
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
        user_id: user.id,
        email,
        firstname,
        lastname,
        gender: gender || null,
        phone: phone || null,
        address: address || null,
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

      // Step 3: Insert user role into the `user_roles` table
      const roleData = {
        user_id: user.id, // Matches auth.users(id)
        role: "user",
      };
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([roleData]);

      if (roleError) {
        console.error("Supabase user_roles insert error:", roleError);
        const message =
          roleError.message || "There was an error saving user role.";
        toast.error(message, { position: "bottom-center" });
        throw new Error(message);
      }

      if (setUser) {
        setUser(authData.user);
      }
      toast.success("User created successfully!", { position: "top-center" });
      setTimeout(() => reset(), 2000);

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a password"
              aria-describedby="password-error"
              {...register("password", {
                required: "Please enter a valid password.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            {errors.password && (
              <p id="password-error" className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
            <span className="flex items-center mt-1">
              <Info size={16} className="mr-1" />
              <p className="text-xs">Password must be 8 characters long</p>
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              aria-describedby="confirmPassword-error"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match.",
              })}
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-destructive text-sm"
              >
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
              {...register("address")}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="outline"
          disabled={isLoading}
          className="w-full hover:bg-primary hover:text-white col-span-1 md:col-span-2"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Spinner />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}{" "}
        </Button>
      </form>
    </section>
  );
}

export default Register;
