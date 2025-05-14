import React from "react";

function Fallback() {
  return (
    <div className="flex mt-14 md:mt-20 py-10 justify-center items-center">
      <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

export default Fallback;
