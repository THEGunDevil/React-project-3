import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useUtils } from "@/hooks/useUtils";
import StatusDropdown from "../StatusDropdown";
import Fallback from "../Loader/Fallback";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import SearchBox from "./SearchBox";
const Orders = () => {
  const { truncate, CalculateLocalDate } = useUtils();
  const [searchedOrders, setSearchedOrders] = useState(null);
  const {
    data: orders,
    error: ordersError,
    loading: ordersLoading,
  } = useSupabaseQuery({ table: "orders" });
  if (ordersLoading) return <Fallback />;
  if (ordersError) {
    console.error("There was an error fetching orders data.");
    return (
      <h1 className="text-center text-destructive text-xl font-bold font-primary">
        There was an error fetching orders data.
      </h1>
    );
  }
  return (
    <section className="space-y-4">
      <SearchBox
        inputType="email"
        searchedBy="customer_email"
        data={orders}
        setSearchedData={setSearchedOrders}
        loading={ordersLoading}
      />
      <Card>
        <Table>
          <TableCaption>List of all orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Order ID</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="text-center">Customer Email</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Order Status</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-center">Delivery Status</TableHead>
              <TableHead className="text-center">Delivery Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(searchedOrders ?? orders)?.map((order) => (
              <TableRow key={order.id} className="text-center">
                <TableCell>{truncate(order.id, 8)}</TableCell>
                <TableCell>{CalculateLocalDate(order.created_at)}</TableCell>
                <TableCell className="text-center w-70">
                  {order.customer || "Not Provided"}
                </TableCell>
                <TableCell className="text-center w-70">
                  {order.customer_email || "Not Provided"}
                </TableCell>
                <TableCell>{order.payment_status || "Not Provided"}</TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <StatusDropdown order={order} statusType="order_status" />
                  </div>
                </TableCell>
                <TableCell>{order.quantity} items</TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <StatusDropdown
                      order={order}
                      statusType="delivery_status"
                    />
                  </div>
                </TableCell>
                <TableCell>{order.delivery_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};

export default Orders;
