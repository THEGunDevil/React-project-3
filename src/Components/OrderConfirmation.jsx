import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center font-primary">
      <Card className="p-8">
        <CardContent className="space-y-4">
          <CheckCircle className="mx-auto text-green-500 w-12 h-12" />
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-gray-600">Your order has been placed successfully.</p>
        </CardContent>
      </Card>
    </div>
  );
}