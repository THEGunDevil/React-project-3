import { Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCart } from "@/Contexts/CartContext";
import QuantityBtn from "./QuantityButton";
import AdsSwiper from "./Banners/AdsSwiper";
import { UserContext } from "@/Contexts/UserContext";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import Fallback from "./Loader/Fallback";
import Spinner from "./Loader/Spinner";

function Cart() {
  const { cartProducts,setCartProducts, removeFromCart } = useCart();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  
  // Calculate total safely
  const total = Array.isArray(cartProducts)
    ? cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

const handleCheckOut = async (userId) => {
  setIsLoading(true);
  if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
    toast.error("Your cart is empty.");
    setIsLoading(false);
    return;
  }
  const orderData = cartProducts.map((product) => ({
    ...product,
    user_id: userId,
  }));
  try {
    const { error: cartProductError } = await supabase
      .from("orders")
      .insert(orderData);
    if (cartProductError) {
      console.error(cartProductError);
      toast.error(cartProductError.message, { position: "top-center" });
    } else {
      console.log("Order placed successfully!");
      toast.success("Order placed successfully!", {
        position: "bottom-center",
      });
      setCartProducts([]); // Clear the cart
    }
  } catch (error) {
    console.error(error);
    toast.error("There was an error placing your order.");
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) return <Fallback />;

  return (
    <>
      <section className="mt-15 md:mt-20 font-primary md:flex w-screen md:justify-center md:items-start md:space-x的管理">
        <div className="flex justify-center px-10">
          {/* Cart list */}
          <Card className="sm:max-w-xl min-w-[320px] mx-auto shadow-xl md:px-6">
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
                        ${item.price} × {item.quantity}
                      </p>
                      <div className="text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        className="cursor-pointer hover:text-destructive absolute -top-2 right-0"
                        size="icon"
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
                  className="w-full hover:bg-green-500 bg-green-600 cursor-pointer"
                  onClick={() => {
                    handleCheckOut(user?.id);
                  }}
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
        </div>
        <Card className="w-100 hidden h-50 md:h-60 lg:flex justify-center">
          {/* Ads Banner */}
          <AdsSwiper />
        </Card>
      </section>
    </>
  );
}

export default Cart;