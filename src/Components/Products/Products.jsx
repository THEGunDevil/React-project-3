import { useFetchPrdcts } from "@/hooks/useFetchPrdcts";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useTruncate } from "@/hooks/useTruncate";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/Contexts/CartContext";
function Products() {
  const { products } = useFetchPrdcts();
  const Truncate = useTruncate();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <section className="p-6 space-y-5 font-primary">
      <h1 className="text-xl text-primary font-primary font-bold">
        Our Products
      </h1>
      <div className=" grid md:gap-6 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {products?.map((product) => (
          <Card
            key={product.id}
            onClick={(e) => {
              e.stopPropagation();
              // navigate(`/product/${product.id}`);
            }}
            className="group w-full max-w-[400px] rounded-md p-1.5 sm:p-3 shadow-lg hover:-translate-y-2 duration-500 ease-in-out transition-transform"
          >
            <CardHeader className="p-1.5">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="rounded-md h-30 sm:h-65 w-full object-cover group-hover:scale-102 duration-500 ease-in-out transition-transform mix-blend-multiply"
              />
            </CardHeader>
            <CardContent className="p-1.5 -mt-9 md:-mt-7">
              <CardTitle className="text-md md:text-xl font-semibold leading-snug">
                {product.title}
              </CardTitle>
              <CardDescription className="text-[12px] md:text-sm text-gray-500 mt-0.5">
                {Truncate(product.description, 40)}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between px-1.5">
              <span className="text-lg font-bold text-green-600">
                ${product.price}
              </span>
              <Button
                onClick={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
                className="rounded-xl md:bg-green-500 md:hover:bg-green-700 cursor-pointer md:text-white bg-transparent text-green-500 md:shadow shadow-none text-[13px] sm:text-sm"
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
