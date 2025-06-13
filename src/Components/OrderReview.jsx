import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderReview({ shippingData, paymentData, cartItems, onConfirm }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 mt-10 font-primary">
      {/* Shipping Info */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h2>
          <p>{shippingData.fullName}</p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.city}, {shippingData.state} {shippingData.postalCode}
          </p>
          <p>{shippingData.country}</p>
          <p>{shippingData.phone}</p>
          <p>{shippingData.email}</p>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
          <p>Cardholder: {paymentData.cardName}</p>
          <p>Card ending in: **** {paymentData.cardNumber.slice(-4)}</p>
          <p>Email: {paymentData.email}</p>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>
              $
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="text-center">
        <Button onClick={onConfirm} className="w-full">
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
