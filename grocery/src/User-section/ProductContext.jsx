// ProductContext.js
import React, { createContext, useState } from 'react';

// Create a Context for the product data
export const ProductContext = createContext();

// Create a Provider component
export const ProductProvider = ({ children }) => {
  const [productCount, setProductCount] = useState(0);

  const addProduct = () => {
    setProductCount(prevCount => prevCount + 1);
  };

  return (
    <ProductContext.Provider value={{ productCount, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
