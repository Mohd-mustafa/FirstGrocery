import React, { useContext, useState, useCallback, useEffect } from 'react';
import { BrowserRouter,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin, faShoppingCart, faSignInAlt, faSearch, faL } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; // Import the CSS file for styling
import { useCart } from '../../User-section/User-dashboard/CartContext';
import itemtotal from '../../assets/item-totl.png';
import fastdelivery from '../../assets/fast-delivery.png';
import bag from '../../assets/shopping-bag.png';
import firstGrocery from '../../assets/FirstGroceryLogo.png'
import axiosInstance from '../../Services/axiosInstance';
 import loginService from "../../Services/loginService";

const Navbar = ({onCartToggle} ) => {
  const { cart, setCart,isCartOpen,setIsCartOpen } = useCart(); // Get the total number of items in the cart
  const [cartOpen, setCartOpen] = useState(false); // State to manage cart visibility
  const [totals, setTotals] = useState({ totalAmount: 0, totalSavings: 0, totalPrice: 0 });
  const [deliveryCharges, setDeliveryCharges] = useState(50); // Default delivery charges
  const [handlingCharges, setHandlingCharges] = useState(7); // Default handling charges set to 7
  const distanceToUser = 2.5; // Example distance, in kilometers
  const [grandTotal, setGrandTotal] = useState(0); // State to hold grand total
  const [isOpen, setIsOpen] = useState(false);
  const [user,setUser]=useState(null);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const navigate = useNavigate();


   // Helper function to calculate total items
  const getTotalItems = useCallback(() => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    let totalAmount = 0;
    let totalSavings = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(item => {
      totalAmount += item.discountPrice * item.quantity;
      totalSavings += (item.price - item.discountPrice) * item.quantity;
      totalPrice += item.price * item.quantity;
     });
    return { totalAmount, totalSavings, totalPrice };
  }, [cart]);  

  useEffect(() => {
    const fetchUser = async () => {
      const userData = LoginService.getUser(); // Fetch user from localStorage
       if (userData) {
        setUser(userData);
       }
    };

    fetchUser();
  }, []);

     useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
    
  }, []);

  // Calculate totals and delivery charges on cart changes
  useEffect(() => {
    const newTotals = calculateTotals();
    setTotals(newTotals);

    if (newTotals.totalAmount > 499) {
      setDeliveryCharges(0); // Free delivery for orders above ₹499
    } else {
      setDeliveryCharges(50); // Regular delivery charge for orders below ₹499
    }

    // Calculate and set grand total after updating totals
    const newGrandTotal = newTotals.totalAmount + deliveryCharges + handlingCharges;
    setGrandTotal(newGrandTotal);
  }, [cart, calculateTotals, deliveryCharges, handlingCharges]);

  const { totalAmount, totalSavings, totalPrice } = totals;
  

  // Toggle the cart drawer visibility
  // Toggle cart drawer
  const toggleCartDrawer = () => {
     setCartOpen((prevState) => {
      const newState = !prevState;
      if (onCartToggle) {
        onCartToggle(newState); // Only call if onCartToggle is defined
      }
      return newState;
    });
  };

  // Decrease product quantity or remove it from the cart
  const decrementQuantity = useCallback((product, event) => {
    if (event) {
      event.stopPropagation();
    }

    setCart((prevCart) => {
      const newCart = { ...prevCart };

      if (newCart[product.productId] && newCart[product.productId].quantity > 1) {
        newCart[product.productId].quantity -= 1;
        axiosInstance.put(`/api/cart/${product.productId}/decrement`)
        .then((response) =>{
          console.log("Quantity decremented in the database", response.data);

        })
        .catch((error) =>{
          console.error("Error updating cart in the database", error);

        })
      } else if (newCart[product.productId] && newCart[product.productId].quantity === 1) {
        delete newCart[product.productId];
        axiosInstance.delete(`/api/cart/${product.productId}`)
        .then((response) =>{
          console.log("Item removed from the database", response.data);

        })
        .catch((error) =>{
          console.error("Error removing item from the database", error);

        })
      }

      return newCart;
    });
  }, [setCart]);

  // Increase product quantity
  const incrementQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [product.productId]: {
          ...prevCart[product.productId],
          quantity: prevCart[product.productId].quantity + 1,
        },
      };
      axiosInstance.put(`/api/cart/${product.productId}/increment`)
      .then((response) =>{
        console.log("Quantity incremented in the database", response.data);

      })
      .catch((error) =>{
        console.error("Error updating cart in the database", error);

      })

      return updatedCart;
    });
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [product.productId]: {
          ...product,
          quantity: 1,
        },
      };
      return updatedCart;
    });
  };
 
  const handlePayment = () => {
    navigate(`/checkOut/${user.id}`); // Correct usage
  };

  const logout = () =>{ 
    localStorage.removeItem('token')
    sessionStorage.removeItem('categories')
    window.location.href= '/login'
  }

  const defaultAddress = user?.addresses?.find(addr=>addr.isDefault) || user?.addresses?.[0]
  
  if(!user || !defaultAddress) return null;

  const fullAddress =  `${user.fullName}, ${defaultAddress.area}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}` 
  
  const words = fullAddress.split(" ");
  const shortAddress = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");


  return (
    <div>
      <header className="header">
        <div className="header-logo">
            <span>FirstGrocery</span>
        </div>
         <div className="header-location" onClick={() => setShowFullAddress(!showFullAddress)}>
        <strong>Delivering: </strong>&nbsp; { shortAddress} ▼
         </div>
         {
          showFullAddress && (
            <div  className='address-card'>
          <p>{fullAddress}</p>
        </div>
          )
         } 

         <div className="header-search">
      <input type="text" placeholder="Search..." className="search-input" />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>
       
        <div className="dropdown-container">
      {/* Account Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
        Account ▼
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li className='account'>
              <span>My Account</span>
              <span>{user.phoneNumber}</span>
            </li>
            <li>My Orders</li>
            <li>Addres</li>
            <li>FAQ's</li>
            <li>Account Privacy</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}
    </div> 

    <div className="header-cart">
          <button className="cart-button" onClick={toggleCartDrawer}>
            <span className="cart-icon">🛒</span>
            <span className="cart-item-count">Items: {getTotalItems()}</span>
          </button>
        </div>
      </header>

      {cartOpen && <div className="overlay" onClick={toggleCartDrawer}></div>}

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h4>Your Cart</h4>
          <span onClick={toggleCartDrawer} className="close-cart-button">&times;</span>
        </div>
        <p className="saving">
          <span className="save-label">Your Save</span>
          <span className="save-amount">₹{totalSavings}</span>
        </p>
        <div className="cart-drawer-content">
          {Object.values(cart).map((product, index) => (
            <div className="cart-item" key={index}>
              <img src={product.imageUrl} alt={product.name} className="cart-image" />
              <div className="cart-item-details">
                <span className="cart-item-name">{product.name}</span>
                <span className="cart-item-quantity">{product.quantity}</span>
                <div className="cart-middle-container">
                  <span className="cart-item-discount-price">₹{product.discountPrice}</span>
                  <span className="cart-item-price">₹{product.price}</span>
                </div>
              </div>
              <div className="product-add-button">
                <div className="quantity-controls"> 
                  <span
                    onClick={(event) => decrementQuantity(product, event)}
                    className="incredecre"
                  >
                    -
                  </span>
                  <span className="quantity">{product.quantity}</span>
                  <span
                    onClick={() => incrementQuantity(product)}
                    className="incredecre"
                  >
                    +
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='bill-details'>
          <div className='items-section'>
            <span className='bill-title'>Bill Details</span>
          </div>
          <div className='items-section'>
            <span className='item-total'>
              <img src={itemtotal} alt="Item Total" className="item-image" /> 
              Items total <span className='total-saved'> Saved ₹{totalSavings}</span>
            </span>
            <span className='actual-value'>
              <span className='discount-value'>₹{totalPrice}</span> ₹{totalAmount}
            </span>
          </div>
          <div className='items-section'>
            <span className='item-total'>
              <img src={fastdelivery} alt="Delivery" className="item-image" /> 
              Delivery Charge
            </span>
            <span className='actual-value'>
              {deliveryCharges > 0 ? `₹${deliveryCharges}` : 'Free'}
            </span>
          </div>
          <div className='items-section'>
            <span className='item-total'>
              <img src={bag} alt="Handling" className="item-image" /> 
              Handling Charges
            </span>
            <span className='actual-value'>
              ₹{handlingCharges}
            </span>
          </div>
          <div className='grand-total-section'>
            <span className='grant-total'>Grand Total</span>
            <span className='actual-value-grand-total'>₹{grandTotal}</span>
          </div>
          <div className='grand-saving-section'>
            <span className='grant-saving'>You Saved</span>
            <span className='actual-value-grand-saving'>₹{totalSavings}</span>
          </div>
        </div>
        <div className='cancelation-policy-card'>
        <h5 className='card-title'>Cancellation Policy</h5>
        <p className='card-description'>
      Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
  </p>
</div>   
 
<div className='proceed-to-pay'>  
     <div className='delivering-to-home'>
      <div>
      <FontAwesomeIcon icon={faLocationPin}/>
      </div>
     <div className='address'>
     <h5>Delivering to {defaultAddress.addressType}</h5>
     <span> 
      {fullAddress}
     </span>
         </div> 
     <a>change</a>
      </div>    
         <hr/>
         <button className="proceed-to-pay-button" onClick={handlePayment}>
  <p className="price">
    <span>Total: <span className="amount">229</span></span>
  </p>
  <p>Proceed To Pay</p>
</button>
   </div>

      </div>
      
    </div>
  );
};

export default Navbar;
