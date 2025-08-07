import React, { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon } from "lucide-react";

function RefreshButton({ refetch }) {
  const [load, setLoad] = useState(false);
  const handleRefresh = async () => {
    setLoad(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Refetch failed:", error);
    }
    setLoad(false);
  };
  return (
    <Button
      className="hover:bg-green-400 cursor-pointer"
      onClick={() => handleRefresh()}
    >
      <LoaderCircleIcon
        className={`${load ? "animate-spin transform -scale-x-100" : "hidden"}`}
      />
      Refresh
    </Button>
  );
}

export default RefreshButton;
