import React, { useState } from 'react'
import './PaymentMethod.css'
import xyz from '../../assets/apple.jpeg'


const PaymentMethod = () => {

  const [visibleItems,setVisibleItems]=useState(3);

  const cartItems = [
    { id: 1, name: "Apple", weight: "200g", price: 24, img: {xyz} },
    { id: 2, name: "Banana", weight: "500g", price: 30, img: {xyz} },
    { id: 3, name: "Mango", weight: "1kg", price: 50, img: {xyz} },
    { id: 4, name: "Orange", weight: "300g", price: 28, img: {xyz} },
    { id: 5, name: "Grapes", weight: "400g", price: 35, img: {xyz} },
    { id: 6, name: "Pineapple", weight: "1.5kg", price: 60, img: {xyz} },
    { id: 6, name: "Pineapple", weight: "1.5kg", price: 60, img: {xyz} },

  ];
  
  return (
    <div className='payment-method-container'>
         <div className='payment-methods'>
         <h2 className='delivery-address'>Delivery Address</h2>
         <p className='actual-address'>Home: mohd mustafa, Nasheman Nagar, IDPL Staff Cooperative Housing Society, 
          Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Hyderabad</p>
         <div className='cart-items'>
         <p>My Cart </p>
         <p>{cartItems.length} Items</p>
         </div>
         {cartItems.slice(0, visibleItems).map((item) =>(
              <div key={item.id} className='cart-menu-items'>
              <span>1</span>
              <img src={item.img} className='cart-menu-image' alt={item.name}/>
              <div className='cart-menu-details'>
              <span className='cart-menu-fruit'>{item.name}</span>
              <span className='cart-menu-grams'>{item.weight}</span>
              <span className='cart-menu-price'>{item.price}</span>
              </div>
              <div>
              <span></span>
              </div>
              </div>
         ))}

         {visibleItems < cartItems.length && (
          <a onClick={() => setVisibleItems(visibleItems + 3)} className='show-more-btn'>
           Show More
          </a>
         )}
         <div>
         <button className='pay-now'>Pay Now</button>
         </div>
          </div>
         <div className='amount-details'>
         <h2>Right Column</h2>
         <p>This is the right column. You can add any content here.</p>
         </div>
    </div>
  )
}

export default PaymentMethod