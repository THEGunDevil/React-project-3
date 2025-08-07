import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useUtils } from "@/hooks/useUtils";
import { useNavigate } from "react-router-dom";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

import Fallback from "../Loader/Fallback";
import { useCart } from "@/Contexts/CartContext";
function Products() {
  const { truncate, CalculateDiscount } = useUtils();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {
    data: products,
    error,
    loading,
  } = useSupabaseQuery({
    table: "products",
    select: "*",
  });
  if (loading) return <Fallback />;
  if (error) {
    console.error(error);
    toast.error(error, { position: "bottom-center" });
    return <p className="text-center mt-6 text-red-500">Product not found.</p>;
  }
  if (!products) {
    return <p className="text-center mt-6 text-red-500">Product not found.</p>;
  }

  return (
    <section className="p-6 space-y-5 font-primary">
      <h1 className="text-xl text-primary font-primary font-bold">
        Our Products
      </h1>
      <div className=" grid md:gap-6 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {products?.map((product) => (
          <Card
            key={product.id}
            onClick={() => {
              navigate(`/product/${product.id}`);
            }}
            className="w-full max-w-[400px] rounded-md p-1.5 sm:p-3 hover:-translate-y-1 shadow-none border duration-500 ease-in-out transition-transform"
          >
            <CardHeader className="p-1.5">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="rounded-md h-30 sm:h-65 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-1.5 -mt-9 md:-mt-7">
              <CardTitle className="text-md md:text-xl font-semibold">
                {truncate(product.title, 40)}
              </CardTitle>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between px-1.5">
              <span className="text-lg font-bold text-green-600">
                ${CalculateDiscount(product.price, product.discount)}
              </span>
              <Button
                onClick={(e) => {
                  addToCart(product);
                  e.stopPropagation();
                }}
                className="rounded-xl shadow-none sm:bg-green-500 sm:hover:bg-green-400 cursor-pointer md:text-white bg-transparent text-green-500 text-[13px] sm:text-sm"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Products;
