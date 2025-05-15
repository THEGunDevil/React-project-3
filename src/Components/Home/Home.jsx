import React from "react";
import { Button } from "../ui/button";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Featured from "./Featured";
import Products from "../Products/Products";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-screen font-primary relative h-60 md:h-120 bg-green-300 mt-14 md:mt-20">
        <div className="flex justify-center h-full opacity-50">
          <img
            src="/Images/487004623_10161542032427804_4390424780956800525_n.jpg"
            alt=""
            className="h-full"
          />
        </div>
        <div className="flex flex-col justify-center items-center absolute left-1/2 top-30 md:top-50 -translate-1/2">
          <h1 className="text-3xl font-bold text-nowrap text-green-500">
            Charlotte Katakuri
          </h1>
          <p className="text-nowrap text-[13px] md:text-[15px] text-white">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </p>
          <Button
            onClick={() => navigate("register")}
            className={
              "hover:bg-green-400 bg-transparent border text-white w-[100px] mt-15"
            }
          >
            Get Started
          </Button>
          <span className="text-2xl mt-2.5 text-green-400 transition animate-bounce">
            <FaAngleDown />
          </span>
        </div>
      </section>
      <Featured />
      <Products/>
    </>
  );
}

export default Home;
