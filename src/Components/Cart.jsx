import { Badge, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCart } from "@/Contexts/CartContext";
import QuantityBtn from "./QuantityButton";
function Cart() {
  const { cartProducts, removeFromCart } = useCart();
  const total = cartProducts.reduce(
  (acc, item) => acc + item.price * item.quantity,
  0
);

  return (
    <>
      <section className="bg-green-300 mt-14 md:mt-20 py-10 font-primary">
        <Card className="w-full md:max-w-xl max-w-sm mx-auto shadow-xl">
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartProducts.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Your cart is empty.
              </p>
            ) : (
              cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-15 md:w-25 flex justify-center items-center">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="md:h-18 h-13"
                      />
                    </div>
                    <p className="font-medium text-sm text-primary md:w-40 w-20">
                      {item.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:w-60 w-40">
                    <QuantityBtn itemId={item.id} quantity={item.quantity} />
                    <p className="text-[13px] hidden md:block text-muted-foreground">
                      ${item.price} × {item.quantity}
                    </p>
                    <div className="text-primary">
                      ${item.price * item.quantity}
                    </div>
                    <Button
                      className="cursor-pointer hover:bg-green-400 shadow"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {cartProducts.length > 0 && (
              <>
                <div className="flex justify-between pt-4 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-green-700">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full hover:bg-green-700 cursor-pointer">Checkout</Button>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export default Cart;
