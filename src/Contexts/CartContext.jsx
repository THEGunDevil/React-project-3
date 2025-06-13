import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("cartProducts");
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error("Failed to parse cartProducts from localStorage:", error);
      localStorage.removeItem("cartProducts");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      return;
    }
    if (!Array.isArray(cartProducts)) {
      console.error("cartProducts is not an array:", cartProducts);
      setCartProducts([{ ...product, quantity: 1 }]);
      return;
    }
    const exists = cartProducts.find((p) => p.id === product.id);
    if (exists) {
      setCartProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCartProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    }
    toast.success("Product added to your cart", {position:"top-center"})
  };

  const removeFromCart = (id) => {
    setCartProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = (id, e) => {
    e.stopPropagation();
    setCartProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id, e) => {
    e.stopPropagation();
    setCartProducts((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        setCartProducts,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);