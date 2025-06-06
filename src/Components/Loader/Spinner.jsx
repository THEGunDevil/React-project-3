import React from "react";

function Spinner() {
  return (
    <>
      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
        />
      </svg>
    </>
  );
}

export default Spinner;
