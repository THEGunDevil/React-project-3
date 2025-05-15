// src/hooks/useTruncate.js
export const useTruncate = () => {
  const truncate = (text = "", maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return truncate;
};
