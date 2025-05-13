import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [itemCount, setItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false); // Initialize with false

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      
      if (newCart[product.name]) {
        newCart[product.name].quantity += 1;
      } else {
        newCart[product.name] = { ...product, quantity: 1 };
      }
      
      const totalItemCount = Object.values(newCart).reduce((total, item) => total + item.quantity, 0);
      setItemCount(totalItemCount);

      return newCart;
    });
  };

  const toggleCart = () => 
    setIsCartOpen(!isCartOpen);
  

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, setCart, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

 