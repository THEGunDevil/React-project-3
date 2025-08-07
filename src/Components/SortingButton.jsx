import React, { useState } from "react";
import { FaSort } from "react-icons/fa6";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

function SortingButton({ handleSorting }) {

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="border hover:border-green-500 hover:bg-white hover:text-primary cursor-pointer"
          >
            <FaSort className="mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-46 mr-10">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleSorting(true)}
          >
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleSorting(false)}
          >
            Descending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SortingButton;
