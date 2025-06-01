import { useState } from "react";
import { supabase } from "@/supabaseClient";

function StatusDropdown({ order }) {
  const [status, setStatus] = useState(order.order_status); // Local state

  const handleChange = async (newStatus) => {
    setStatus(newStatus); // Update UI immediately

    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", order.id);

      if (error) {
        console.error("Error updating order status:", error);
        setStatus(order.order_status); // Revert on error
        return;
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus(order.order_status); // Revert on error
    }
  };

  return (
    <select
      value={status} // Use local state
      className="block w-fit px-3 py-1 border rounded-md"
      aria-label="Selecting order status"
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="Delivered">Delivered</option>
      <option value="Shipped">Shipped</option>
      <option value="Processing">Processing</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
      <option value="Refunded">Refunded</option>
      
    </select>
  );
}

export default StatusDropdown;