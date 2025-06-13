import React from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import Fallback from "../Loader/Fallback";
import {
  TableRow,
  TableCell,
  TableHeader,
  Table,
  TableHead,
  TableBody,
} from "../ui/table";
import { useUtils } from "@/hooks/useUtils";

export function UserOrdersTable({ userId }) {
  const { CalculateLocalDate } = useUtils();
  const { data, error, loading } = useSupabaseQuery({
    table: "orders",
    select: "*",
    filters: [{ column: "user_id", operator: "eq", value: userId }],
    enabled: !!userId,
  });

  if (loading) return <Fallback />;
  if (error) return <div className="text-red-500">Failed to load orders</div>;
  if (!data || data.length === 0) return <div>No orders found.</div>;

  return (
    <div className="max-h-[400px] overflow-y-auto border rounded-md scrollbar-hide">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="shadow-sm">
            <TableHead className="text-center">Order ID</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Order Status</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-center">Delivery Status</TableHead>
            <TableHead className="text-center">Delivery Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id} className="text-center hover:bg-gray-300">
              <TableCell>{order.id}</TableCell>
              <TableCell>{CalculateLocalDate(order.created_at)}</TableCell>
              <TableCell>{order.payment_status}</TableCell>
              <TableCell>${order.total_amount}</TableCell>
              <TableCell>{order.order_status}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.delivery_status}</TableCell>
              <TableCell>{order.delivery_method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
