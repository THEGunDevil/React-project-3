import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const navigate = useNavigate() 
  const onSubmit = (data) => {
    console.log("Payment Info:", data);
    navigate("orderreview")
  };

  return (
    <Card className="max-w-2xl mx-auto p-8 shadow-xl rounded-2xl mt-14 md:mt-25 font-primary">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Payment Information</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              {...register("cardName", { required: "Cardholder name is required" })}
              placeholder="John Doe"
            />
            {errors.cardName && (
              <p className="text-sm text-red-500">{errors.cardName.message}</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              {...register("cardNumber", {
                required: "Card number is required",
                pattern: {
                  value: /^\d{16}$/,
                  message: "Card number must be 16 digits",
                },
              })}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>

          {/* Expiry / CVV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                {...register("expiry", {
                  required: "Expiry date is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                    message: "Format should be MM/YY",
                  },
                })}
                placeholder="MM/YY"
              />
              {errors.expiry && (
                <p className="text-sm text-red-500">{errors.expiry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                {...register("cvv", {
                  required: "CVV is required",
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: "CVV must be 3 or 4 digits",
                  },
                })}
                placeholder="123"
              />
              {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
            </div>
          </div>

          {/* Billing Email (optional) */}
          <div className="space-y-2">
            <Label htmlFor="email">Billing Email</Label>
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
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full mt-6">
            Complete Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
