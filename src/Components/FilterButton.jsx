import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";

export function FilterButton({ orders, onFilter }) {
  const filterFor = {
    Payment: ["Pending", "Paid", "Processing"],
    "Order Status": [
      "Pending",
      "Delivered",
      "Shipped",
      "Processing",
      "Completed",
      "Cancelled",
      "Refunded",
    ],
    "Delivery Status": [
      "Out for Delivery",
      "Not Shipped",
      "Shipped",
      "Delivered",
      "Returned",
      "Failed Delivery",
    ],
  };
  const handleFilteration = (category, option) => {
    let filteredData = [];

    if (category === "Payment") {
      filteredData = orders.filter((order) => order.payment_status === option);
    } else if (category === "Order Status") {
      filteredData = orders.filter((order) => order.order_status === option);
    } else if (category === "Delivery Status") {
      filteredData = orders.filter((order) => order.delivery_status === option);
    }
    onFilter(filteredData); // Pass up
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="border hover:border-green-500 hover:bg-white hover:text-primary cursor-pointer"
          >
            <FilterIcon className="mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-46 mr-10">
          <DropdownMenuLabel>Select Filter</DropdownMenuLabel>

          {Object.entries(filterFor).map(([category, options]) => (
            <DropdownMenuSub key={category}>
              <DropdownMenuSubTrigger className="cursor-pointer">
                {category.replace(/_/g, " ")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {options.map((option) => (
                  <DropdownMenuItem
                    className="hover:bg-gray-100 cursor-pointer"
                    key={option}
                    onClick={() => {
                      handleFilteration(category, option);
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
