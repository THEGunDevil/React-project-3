import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import { useNavigate } from "react-router-dom";

export default function ShippingInformationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [locks, setLocks] = useState({
    city: false,
    state: false,
    district: false,
    division: false,
  });

  const toggleLock = (field) => (checked) => {
    setLocks((prev) => ({
      ...prev,
      [field]: !!checked,
    }));
  };

  const onSubmit = (data) => {
    console.log("Shipping Info:", data);
    navigate("/paymentpage");
  };

  return (
    <Card className="max-w-2xl mx-auto p-8 shadow-xl rounded-2xl mt-14 md:mt-25 font-primary">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Shipping Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Enter your name"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="1234 Main St"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City / State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="city" className={locks.city ? "text-gray-400" : ""}>City</Label>
                <Checkbox checked={locks.city} onCheckedChange={toggleLock("city")} />
              </div>
              <Input
                id="city"
                {...register("city", {
                  required: !locks.city ? "City is required" : false,
                })}
                placeholder="New York"
                disabled={locks.city}
                className={locks.city ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="state" className={locks.state ? "text-gray-400" : ""}>State / Province</Label>
                <Checkbox checked={locks.state} onCheckedChange={toggleLock("state")} />
              </div>
              <Input
                id="state"
                {...register("state", {
                  required: !locks.state ? "State is required" : false,
                })}
                placeholder="NY"
                disabled={locks.state}
                className={locks.state ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Postal Code / Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                placeholder="10001"
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country", { required: "Country is required" })}
                placeholder="United States"
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* District / Division */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="district" className={locks.district ? "text-gray-400" : ""}>District</Label>
                <Checkbox checked={locks.district} onCheckedChange={toggleLock("district")} />
              </div>
              <Input
                id="district"
                {...register("district", {
                  required: !locks.district ? "District is required" : false,
                })}
                placeholder="Brahmanbaria"
                disabled={locks.district}
                className={locks.district ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="division" className={locks.division ? "text-gray-400" : ""}>Division</Label>
                <Checkbox checked={locks.division} onCheckedChange={toggleLock("division")} />
              </div>
              <Input
                id="division"
                {...register("division", {
                  required: !locks.division ? "Division is required" : false,
                })}
                placeholder="Chittagong"
                disabled={locks.division}
                className={locks.division ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {errors.division && (
                <p className="text-sm text-red-500">{errors.division.message}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6 hover:bg-green-400 cursor-pointer">
            Continue to Billing
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
