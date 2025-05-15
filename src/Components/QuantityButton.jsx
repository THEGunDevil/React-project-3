import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useCart } from "@/Contexts/CartContext";

const QuantityBtn = ({ itemId, quantity }) => {
  const { incrementQuantity, decrementQuantity } = useCart();
  const maxOrderNum = 10;

  return (
    <div className="flex flex-row items-center text-green-500 justify-between">
      <button
        className="bg-white rounded border w-5 h-5 flex cursor-pointer text-green-500 items-center justify-center"
        onClick={(e) => decrementQuantity(itemId,e)}
        disabled={quantity <= 1}
      >
        <FaMinus />
      </button>
      <div className="border w-8 h-5 flex justify-center items-center bg-gray-200 text-sm text-green-500">
        {quantity}
      </div>
      <button
        className="bg-white border rounded w-5 h-5 flex cursor-pointer items-center text-green-500 justify-center"
        onClick={(e) => incrementQuantity(itemId,e)}
        disabled={quantity >= maxOrderNum}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuantityBtn;
