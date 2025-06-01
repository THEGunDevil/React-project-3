import { Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCart } from "@/Contexts/CartContext";
import QuantityBtn from "./QuantityButton";
import { UserContext } from "@/Contexts/UserContext";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import Fallback from "./Loader/Fallback";
import Spinner from "./Loader/Spinner";

export default function Cart() {
  const { cartProducts, setCartProducts, removeFromCart } = useCart();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const total = Array.isArray(cartProducts)
    ? cartProducts.reduce((sum, item) => sum + (Number(item.price) - (Number(item.discount) || 0)) * item.quantity, 0)
    : 0;

  const handleCheckOut = async () => {
    if (!user) {
      toast.error("You must be logged in to checkout.");
      return;
    }
    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    // 1) Create the order record
    const now = new Date().toISOString();
    const orderPayload = {
      user_id: user.id,
      quantity: cartProducts.length,
      customer:`${user.userName}`,
      total_amount: parseFloat(total.toFixed(2)),
      payment_status: "Pending",
      delivery_status: "Pending",
      order_status:"Pending",
      delivery_method:"Home delivery",
      payment_method: "stripe",
      shipping_address: "Not Provided",
      created_at: now,
      updated_at: now,
    };

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select("id")
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;

      // 2) Create the order_items records, including created_at/updated_at
      
      const itemsPayload = cartProducts.map((p) => ({
        order_id: orderId,
        product_id: p.id,
        title: p.title,
        description:p.description,
        quantity: p.quantity,
        discount: p.discount || 0,
        price: parseFloat((Number(p.price) - (Number(p.discount) || 0)).toFixed(2)),
        total_price: parseFloat(((Number(p.price) - (Number(p.discount) || 0)) * p.quantity).toFixed(2)),
        created_at: now,
        updated_at: now,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) {
        // Roll back the order if inserting items fails
        await supabase.from("orders").delete().eq("id", orderId);
        throw itemsError;
      }

      toast.success("Order placed successfully!", { position: "bottom-center" });
      setCartProducts([]);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "There was an error placing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Fallback />;

  return (
    <section className="mt-15 md:mt-20 font-primary w-screen p-6">
      <Card className="w-full min-w-[320px] mx-auto shadow-xl md:px-6">
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 h-80 md:h-130 overflow-scroll scrollbar-hide py-2">
          {!Array.isArray(cartProducts) || cartProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            cartProducts.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2 relative"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-15 md:w-25 flex justify-center items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="md:h-18 h-13"
                    />
                  </div>
                  <p className="font-medium text-[13px] md:text-md text-primary sm:w-40 w-20">
                    {item.title}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:w-60 w-30">
                  <QuantityBtn itemId={item.id} quantity={item.quantity} />
                  <p className="text-[13px] hidden sm:block text-muted-foreground">
                    ${Number(item.price) - (Number(item.discount) || 0)} × {item.quantity}
                  </p>
                  <div className="text-primary">
                    ${((Number(item.price) - (Number(item.discount) || 0)) * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="cursor-pointer hover:text-destructive absolute -top-2 right-0"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        {Array.isArray(cartProducts) && cartProducts.length > 0 && (
          <div className="px-6 space-y-5">
            <div className="flex justify-between pt-4 border-t font-semibold">
              <span>Total</span>
              <span className="text-green-700">${total.toFixed(2)}</span>
            </div>
            <Button
              className="hover:bg-green-400 bg-green-500 float-right"
              onClick={handleCheckOut}
              disabled={!user}
            >
              {isLoading ? (
                <>
                  <Spinner /> Checking Out..
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
