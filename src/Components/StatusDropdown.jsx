import { useState } from "react";
import { supabase } from "@/supabaseClient";

function StatusDropdown({ order, statusType }) {
  const [status, setStatus] = useState(order[statusType]);
  const [isUpdating, setIsUpdating] = useState(false);

  const options = {
    order_status: [
      "Pending",
      "Delivered",
      "Shipped",
      "Processing",
      "Completed",
      "Cancelled",
      "Refunded",
    ],
    delivery_status: [
      "Out for Delivery",
      "Not Shipped",
      "Shipped",
      "Delivered",
      "Returned",
      "Failed Delivery",
    ],
  };

  const handleChange = async (newStatus) => {
    const previousStatus = status;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ [statusType]: newStatus })
        .eq("id", order.id);

      if (error) {
        console.error("Error updating order status:", error);
        setStatus(previousStatus);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus(previousStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status} // Use local state
      className="block w-fit px-3 py-1 border rounded-md"
      aria-label="Selecting order status"
      onChange={(e) => handleChange(e.target.value)}
      disabled={isUpdating}
    >
      {options[statusType].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default StatusDropdown;
