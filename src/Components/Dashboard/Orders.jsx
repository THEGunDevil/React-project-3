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
import { useUtils } from "@/hooks/useUtils";
import StatusDropdown from "../StatusDropdown";
import Fallback from "../Loader/Fallback";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import SearchBox from "./SearchBox";
import { FilterButton } from "../FilterButton";
import RefreshButton from "../RefreshButton";
import SortingButton from "../SortingButton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
const Orders = () => {
  const { truncate, CalculateLocalDate } = useUtils();
  const [searchedOrders, setSearchedOrders] = useState(null);
  const [sortingDirection, setSortingDirection] = useState(true);

  const handleSorting = (direction) => {
    setSortingDirection(direction);
  };
  const {
    data: orders,
    error: ordersError,
    loading: ordersLoading,
    refetch,
  } = useSupabaseQuery({
    table: "orders",
    orderBy: { column: "created_at", ascending: sortingDirection },
  });
  if (ordersError) {
    console.error("There was an error fetching orders data.");
    return (
      <h1 className="text-center text-destructive text-xl font-bold font-primary">
        There was an error fetching orders data.
      </h1>
    );
  }
  useEffect(() => {
    refetch();
  }, [sortingDirection]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of orders per page
  const displayedOrders = (searchedOrders ?? orders) || [];
  const totalPages = Math.ceil(displayedOrders.length / pageSize);

  const paginatedOrders = displayedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <section className="space-y-4">
      <SearchBox
        inputType="email"
        searchedBy="customer_email"
        data={orders}
        setSearchedData={setSearchedOrders}
        loading={ordersLoading}
        label="User Email"
        header="Search Orders"
      />
      <Card>
        <div className="flex justify-end items-center px-4 space-x-2.5">
          <RefreshButton refetch={refetch} />
          <SortingButton handleSorting={handleSorting} />
          <FilterButton orders={orders} onFilter={setSearchedOrders} />
        </div>
        {ordersLoading ? (
          <Fallback />
        ) : (
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
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className="text-center">
                  <TableCell>{truncate(order.id, 8)}</TableCell>
                  <TableCell>{CalculateLocalDate(order.created_at)}</TableCell>
                  <TableCell className="text-center w-70">
                    {order.customer || "Not Provided"}
                  </TableCell>
                  <TableCell className="text-center w-70">
                    {order.customer_email || "Not Provided"}
                  </TableCell>
                  <TableCell>
                    {order.payment_status || "Not Provided"}
                  </TableCell>
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
        )}
        {/* Pagination controls */}
        <Pagination
          aria-label="Pagination Navigation"
          className="flex justify-center w-full"
        >
          <PaginationPrevious
            className="cursor-default"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem className="cursor-default" key={i} active={currentPage === i + 1}>
              <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationNext
            className="cursor-default"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
        </Pagination>
      </Card>
    </section>
  );
};

export default Orders;
