// src/hooks/useTruncate.js
export const useUtils = () => {
  const truncate = (text = "", maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const CalculateDiscount = (price, discount) => {
    const calculatedPrice =
      Number(price) - Number(price) * (Number(discount) / 100);
    return calculatedPrice;
  };
  const CalculateLocalDate = (date) => {
    const calculatedDate = new Date(date).toLocaleDateString();
    return calculatedDate;
  };
  return { truncate, CalculateDiscount, CalculateLocalDate };
};
