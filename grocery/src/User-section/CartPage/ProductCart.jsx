import React from 'react'
import { useCart } from '../contexts/CartContext';
import './CartSidebar.css';


const ProductCart = ({ cartItems, onClose}) => {
  return (
    <div className="cart-card">
      <button className="close-button" onClick={onClose}>✖️</button>
      <h2>Your Cart Items</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <span>{item.name}</span>
              <span>Quantity: {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
    };
    
export default ProductCart