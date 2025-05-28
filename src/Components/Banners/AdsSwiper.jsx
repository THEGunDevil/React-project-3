import React from "react";
import {Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
function AdsSwiper() {
  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 3000 }}
        speed={1500}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="bg-white text-primary font-bold text-6xl h-full w-full flex justify-center items-center">ADS 1</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-white text-primary font-bold text-6xl h-full w-full flex justify-center items-center">ADS 2</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-white text-primary font-bold text-6xl h-full w-full flex justify-center items-center">ADS 2</div>
        </SwiperSlide>
      </Swiper>{" "}
    </>
  );
}

export default AdsSwiper;
