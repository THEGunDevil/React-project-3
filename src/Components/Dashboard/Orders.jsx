import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Circle } from "lucide-react";
import { useFetchOrders } from "@/hooks/useFetchOrders";
import { useTruncate } from "@/hooks/useTruncate";
import StatusDropdown from "../StatusDropdown";
const Orders = () => {
  const truncate = useTruncate();
  const {
    orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useFetchOrders();

  return (
    <>
      <Card>
        <Table>
          <TableCaption>List of all orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Order ID</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Order Status</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => {
              return (
                <TableRow key={order.id} className="text-center">
                  <TableCell>{truncate(order.id, 8)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center w-70 ">
                    {order.customer || "Not Provided"}
                  </TableCell>

                  <TableCell>
                    {order.payment_status || "Not Provided"}
                  </TableCell>
                  <TableCell>${order.total_amount}</TableCell>

                  <TableCell className="flex justify-center items-center">
                    <StatusDropdown order={order} />
                  </TableCell>
                  <TableCell>{order.quantity} items</TableCell>
                  <TableCell className="flex items-center space-x-3 justify-center">
                    <Button
                      aria-label={`Delete order ${order.firstname} ${order.lastname}`}
                      variant="ghost"
                      className="text-gray cursor-pointer hover:text-destructive hover:bg-none hover:shadow-md"
                    >
                      Button
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default Orders;
