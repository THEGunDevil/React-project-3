import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState(() => {
    const stored = localStorage.getItem("cartProducts");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);
  const addToCart = (product) => {
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
    toast.success(`${product.title} added to cart`);
  };

  const removeFromCart = (id) => {
    setCartProducts((prev) => prev.filter((item) => item.id !== id));
    localStorage.removeItem("cartProducts");
    toast.info("Item removed from cart");
  };
  const incrementQuantity = (id,e) => {
    e.stopPropagation();
    setCartProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id,e) => {
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
