// src/components/ProductCard.js
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, addToCart, incrementQuantity, decrementQuantity } = useCart();
  
  // Check if the product is already in the cart
  const productInCart = cart[product.name];

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      {productInCart ? (
        <div className="quantity-controls">
          <button onClick={() => decrementQuantity(product)}>-</button>
          <span>{productInCart.quantity}</span>
          <button onClick={() => incrementQuantity(product)}>+</button>
        </div>
      ) : (
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
