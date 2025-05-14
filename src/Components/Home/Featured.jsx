import React from "react";
import { useAxios } from "@/hooks/useAxios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function Featured() {
  const navigate = useNavigate();
  const { data, loading, error } = useAxios("https://dummyjson.com/products");
  const filteredFeaturedProducts =
    data?.products?.filter((p) => p.rating >= 4.5).slice(0, 3) || [];
  localStorage.setItem(
    "featuredProducts",
    JSON.stringify(filteredFeaturedProducts)
  );
  const featuredProducts = JSON.parse(localStorage.getItem("featuredProducts"));

  if (loading) {
    return (
      <p className="text-center mt-6 text-green-400">
        Loading featured products...
      </p>
    );
  }

  if (error || featuredProducts.length === 0) {
    return (
      <p className="text-center mt-6 text-red-500">
        No featured products found!
      </p>
    );
  }

  return (
    <section className="w-screen mt-5 font-primary md:mt-10 px-4 md:px-20">
      <h2 className="text-green-400 font-bold text-xl mb-3">Featured</h2>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 3000 }}
        speed={1500}
        className="w-full h-50 md:h-100"
      >
        {featuredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              className="relative w-full h-full flex justify-center items-center"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute flex flex-col left-0 bottom-0">
                <span className="mb-1.5 text-green-400 font-semibold">
                  {product.title}
                </span>
                <Button
                  className="hover:bg-green-400 transition-colors duration-150 text-sm font-normal w-[90px] h-[30px]"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Quick View
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Featured;
