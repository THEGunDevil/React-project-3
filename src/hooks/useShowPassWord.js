import { useState } from "react";

export const useShowPassword = () => {
  const [isPassword, setIsPassword] = useState(false);

  function handleShowPassword() {
    setIsPassword((prev) => !prev);
  }

  return { handleShowPassword, isPassword };
};
