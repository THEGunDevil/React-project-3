import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
// import { useAxios } from "@/hooks/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Fallback from "./Loader/Fallback";
import { useFetchSnglPrdct } from "@/hooks/useFetchSnglPrdct";
import { useCart } from "@/Contexts/CartContext";
export default function Product() {
  const { productid } = useParams();
  const navigate = useNavigate();
  
  // const { data, loading, error } = useAxios(
  //   `https://dummyjson.com/products/${productid}`
  // );
  // // if (loading) {
  // //   return (
  // //     <div className="flex mt-14 md:mt-20 py-10 justify-center items-center">
  // //       <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
  // //     </div>
  // //   );
  // // }
  // if (error || !data) {
  //   return <p className="text-center mt-6 text-red-500">Product not found.</p>;
  // }
  const { product: data, isLoading, error } = useFetchSnglPrdct(productid);
const { addToCart } = useCart();
  if (error) {
    console.error(error);
    toast.error(error, { position: "bottom-center" });
    return <p className="text-center mt-6 text-red-500">Product not found.</p>;
  }
  if (isLoading) return <Fallback />;
  return (
    <section className="px-4 mt-14 md:mt-20 md:px-20 flex items-center justify-center font-primary">
      <Card className="w-screen border-0 shadow-none mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-0the">
        <CardHeader className="p-0 h-80 flex justify-center items-center">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="rounded-lg h-80 object-cover"
          />
        </CardHeader>

        <CardContent className="flex flex-col gap-3 justify-center p-0">
          <CardTitle className="text-2xl font-bold">{data.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{data.brand}</Badge>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span>{data.rating}</span>
            </div>
          </div>
          <CardDescription className="text-base text-muted-foreground ">
            {data.description}
          </CardDescription>
          <div className="text-2xl font-semibold text-green-500">
            ${data.price}
          </div>
          <CardFooter className="p-0 mt-4">
            <Button
              className="w-full md:w-fit"
              onClick={() => {
                addToCart(data);
              }}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
}
