
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
import { useUtils } from "@/hooks/useUtils";
import { useNavigate } from "react-router-dom";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import Fallback from "../Loader/Fallback";
function Products() {
  const {truncate,CalculateDiscount} = useUtils();
  const navigate = useNavigate();
  const {
    data: products,
    error,
    loading,
  } = useSupabaseQuery({
    table: "products",
    select:"*",
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
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
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
                {truncate(product.description, 40)}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between px-1.5">
              <span className="text-lg font-bold text-green-600">
                ${CalculateDiscount(product.price, product.discount)}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
                className="rounded-xl md:bg-green-500 md:hover:bg-green-400 cursor-pointer md:text-white bg-transparent text-green-500 md:shadow shadow-none text-[13px] sm:text-sm"
              >
                Quick View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Products;
