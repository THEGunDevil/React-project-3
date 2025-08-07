import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { Card } from "../ui/card";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { Badge } from "../ui/badge";
import { FaHeadphones, FaStar, FaUser, FaWallet } from "react-icons/fa6";
import { useUtils } from "@/hooks/useUtils";
import { FaShippingFast } from "react-icons/fa";
import { Separator } from "../ui/separator";

export default function Profile() {
  const { user } = useContext(UserContext);
  const { CalculateLocalDate } = useUtils();
  const { data, error, loading } = useSupabaseQuery({
    table: "users",
    filters: [{ column: "id", operator: "eq", value: user.id }],
    single: true,
    enabled: !!user.id,
  });
  
  const options = [
    "Personal Information",
    "My Orders",
    "Manage Address",
    "Password Manager",
    "Logout",
  ];
  const otherOptions = [
    {
      icon: FaShippingFast,
      header: "Free Shipping",
      subheader: "Free shipping for order above $50",
    },
    {
      icon: FaWallet,
      header: "Flexible Payment",
      subheader: "Multiple secure payment options",
    },
    {
      icon: FaHeadphones,
      header: "24x7 Support",
      subheader: "We support online all days",
    },
  ];

  const [option, setOption] = useState("Personal Information");
  const handleOption = (option) => {
    setOption(option);
    console.log(option, data);
  };
  return (
    <section className="mt-14 md:mt-20 px-6 font-primary flex flex-col items-center justify-center">
      <section className=" py-20 flex flex-row items-start justify-center space-x-10">
        <div>
          {options.map((option, index) => (
            <ul key={index} className="w-sm">
              <li
                onClick={() => handleOption(option)}
                className="p-2.5 rounded-md hover:bg-green-300 border mt-2.5 cursor-pointer"
              >
                {option}
              </li>
            </ul>
          ))}
        </div>
        {option === "Personal Information" && data ? (
          <div className="space-y-5">
            <div className="w-44 rounded-full">
              <img
                src={
                  user.img ||
                  "/Images/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt=""
                className=" rounded-full"
              />
            </div>
            <section className="">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-semibold">
                  {data.firstname} {data.lastname}
                </h2>
                <Badge>
                  {data.role === "admin" ? <FaStar /> : <FaUser />}
                  {data.role === "admin" ? "Admin" : "User"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {data.gender === "male" ? "Male" : "Female"}
              </span>
              <p className="text-sm text-muted-foreground">
                Joined At: {CalculateLocalDate(data.created_at)}
              </p>
            </section>
          </div>
        ) : (
          ""
        )}
      </section>
      <Separator className="bg-green-500/30"/>
      <section className="flex space-x-10 items-center py-10 cursor-default">
        {otherOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-row items-center space-x-5 shadow-lg border border-green-500/20 shadow-green-500/20 p-4 rounded-xl hover:-translate-y-1 transition-transform duration-300"
          >
<option.icon className="text-primary text-[50px] sm:text-3xl md:text-4xl" />
            <div>
              <p className="font-semibold text-lg text-primary">
                {option.header}
              </p>
              <p className="text-muted-foreground text-[13px]">
                {option.subheader}
              </p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
