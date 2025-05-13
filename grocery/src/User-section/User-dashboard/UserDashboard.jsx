import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin, faShoppingCart, faSignInAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import categoryService from '../../Services/categoryService';
import './UserDashboard.css';
import { useCart } from '../../User-section/User-dashboard/CartContext';
import product from '../../Pages/product';
import axiosInstance from '../../Services/axiosInstance';

const UserDashboard = ( { isCartOpen }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const [subCategory, setSubCategory] = useState([]); 

  const navigate = useNavigate();
  const { cart, setCart } = useCart(); 
  const [itemCount, setItemCount] = useState(0);
 
  
  const sidebarRef = React.useRef(null);
  const handleMouseEnter = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollBy(0, -20); // Scroll the sidebar up by 20px
    }
  };

  const handleMouseLeave = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollBy(0, 20); // Scroll back down when hover ends
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);

      // Update item count based on loaded cart
      const totalItemCount = Object.values(parsedCart).reduce((total, item) => total + item.quantity, 0);
      setItemCount(totalItemCount);
    }
  }, [setCart]);

  useEffect(() => {
    if (cart && Object.keys(cart).length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    else{
      localStorage.removeItem('cart'); // Remove cart if empty

    }
  }, [cart]);
useEffect(() => {
  const fetchAllCategories = async () => {
    try {
      setLoading(true);

      const storedCategories = sessionStorage.getItem("categories");

      if (storedCategories) {
        try {
          const data = JSON.parse(storedCategories);

          if (Array.isArray(data) && data.length > 0) {
            console.log("Using categories from sessionStorage");
            initializeCategories(data);
          } else {
            console.warn("Stored categories are empty, fetching from server...");
            await fetchFromServer();
          }
        } catch (error) {
          console.error("Error parsing sessionStorage data, fetching from server...", error);
          await fetchFromServer();
        }
      } else {
        console.log("No data in sessionStorage, fetching from server...");
        await fetchFromServer();
      }
    } catch (error) {
      console.error("Unexpected error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const fetchFromServer = async () => {
    try {
      const data = await categoryService.getAllCategories();
      sessionStorage.setItem("categories", JSON.stringify(data));
      initializeCategories(data);
    } catch (error) {
      console.error("Error fetching categories from server:", error.message || error);
    }
  };

  const initializeCategories = (categories) => {
    setCategories(categories);

    if (categories.length > 0) {
      const firstCategory = categories[0];
      setSubCategories(firstCategory.subCategories || []);

      if (firstCategory.subCategories && firstCategory.subCategories.length > 0) {
        const firstSubCategory = firstCategory.subCategories[0];
        setProducts(firstSubCategory.products || []);
      } else {
        setProducts([]);
      }
    } else {
      setSubCategories([]);
      setProducts([]);
    }
  };

  fetchAllCategories();
}, []);
  
  const handleCategoriesClick = (category) => {
    setSubCategories(category.subCategories);
    if(category.subCategories.length>0){
      const firstSubCategory=category.subCategories[0];
      setSubCategory(firstSubCategory)
      setProducts(firstSubCategory.products || []);
    }else{
      setProducts([])
    }
  };

  const handleSubCategoriesClick = (subCategory) => {
    if (subCategory && subCategory.products) {
      setProducts(subCategory.products);
    }
  };

  const handleClickCard =(productId,event) =>{
     navigate(`/product-page/${productId}`)
  }

  const addToCart = (product,event) => {
    if (event) {
      event.stopPropagation(); // Prevent event from bubbling up
    }
  
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.productId]) {
        newCart[product.productId].quantity += 1; // Increment quantity if already in cart
        

      } else {
        newCart[product.productId] = { ...product, quantity: 1 }; // Add new product with quantity 1
      }
    // Update the itemCount to reflect the total quantity of items in the cart
      const totalItemCount = Object.values(newCart).reduce((total, item) => total + item.quantity, 0);
      setItemCount(totalItemCount); // Set the itemCount state
      return newCart;
    });
  };

  const decrementQuantity = useCallback((product, event) => {
    if (event) {
      event.stopPropagation();
    }
  
    setCart((prevCart) => {
      const newCart = { ...prevCart };
  
      if (newCart[product.productId] && newCart[product.productId].quantity > 1) {
        newCart[product.productId].quantity -= 1; // Decrease quantity by 1
         axiosInstance.patch('api/cart/decrement',null,{
          params: [product.productId],
         })
         .then(response =>{
          console.log('Item quantity decremented:', response.data);
          setCart(response.data); // Update the cart in state
         })
         

      } else if (newCart[product.productId] && newCart[product.productId].quantity === 1) {
        delete newCart[product.productId]; // Remove product from cart if quantity is 1
         
      }
      
  
      // Update itemCount again after decrementing
      const totalItemCount = Object.values(newCart).reduce((total, item) => total + item.quantity, 0);
      setItemCount(totalItemCount);

      if (Object.keys(newCart).length === 0) {
        localStorage.removeItem('cart'); // Clear localStorage if cart is empty
      }

      return newCart;
    });
  }, [setCart]);

  const clearCart = () => {
    setCart({});
    setItemCount(0);
    localStorage.removeItem('cart'); // Clear localStorage
  };
  
  const incrementQuantity = (product,event) => {
    if (event) {
      event.stopPropagation(); // Prevent event from bubbling up
    }
  
    setCart((prevCart) => {
      if (prevCart[product.productId]) {
        return {
          ...prevCart,
          [product.productId]: {
            ...prevCart[product.productId],
            quantity: prevCart[product.productId].quantity + 1,
          },
        };
      }
      return prevCart;
    });
    // Update itemCount after incrementing
    const totalItemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    setItemCount(totalItemCount);
  };
  return (
    <div className={`user-container `}>
      {categories.length > 0 && (
         <nav className='category-nav'>
         {loading ? (
           <p>Loading categories...</p>
         ) : (
           <ul className='category-list'> 
             {categories.map((category) => (
               <li  
                 key={category.cid}
                 className='category-item'
                 onClick={() => handleCategoriesClick(category)}
               >
                 <a className='category-link'>{category.name}</a>
               </li>
             ))}
           </ul>
         )}
       </nav>
      )}  
       <div className='user-sidebar'   onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
        <ul className='user-side-bar'>
          {subCategories.length > 0 ? (
            subCategories.map((subCategory) => {
              const nameParts = subCategory.name.split('&');
              return (
                <a key={subCategory.id} onClick={() => handleSubCategoriesClick(subCategory)}>
                  <li className='user-side-nav'>
                    <img src={subCategory.imageUrl} alt={subCategory.name} />
                    <div className='name-side'>
                      <p>
                        {nameParts[0].trim()}
                        {nameParts.length > 1 && (
                          <>
                            &amp;
                            <br />
                            {nameParts[1].trim()}
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                </a>
              );
            })
          ) : (
            <p>Select a category to view subcategories.</p>
          )}
        </ul>
      </div>

      <div className='user-main-content'>      
        {products.map((product) => (
          <div className='user-product-card' key={product.productId} 
          onClick={(event) => handleClickCard(product.productId,event)}>
         
            <img src={product.imageUrl} alt="fruits" />
         <div className='product-heading'>
         <p className='product-name'>{product.name}</p>
         <p className='product-quantity'>Qty: {product.quantity}</p>
            </div>
            <div className='price-containers'>
              <div>
              <span className='discount'>&#8377;{product.price}</span>
              <span className='mrp'>&#8377;{product.discountPrice}</span>
              </div>
               
              <div className=''>
               {cart[product.productId] ? (
                <div className='quantity-controls'>
                  <span 
                    onClick={(event) => decrementQuantity(product, event)} // Pass the event here
                    className='incredecre'
                  >
                    -
                  </span>
                  <span className='quantity'>{cart[product.productId].quantity}</span>
                  <span 
                    onClick={(event) => incrementQuantity(product,event)} 
                    className='incredecre'
                  >
                    +
                  </span>
                </div>
              ) : (
                <button className='add-cart' onClick={(event) => addToCart(product,event)}>
                  Add
                </button>
              )}
              </div>
            </div>
          </div>
        ))}

<div className='cart-mobile-view'>
        {itemCount > 0 && ( // Show button only if itemCount is greater than 0
          <button className='cart-mobile-button'>
            <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize:'30px', color: 'white', marginRight:'20px' }} />
            <span style={{ marginLeft: '8px', color: 'black' }}>Items Added: {itemCount}</span>
          </button>
        )}
      </div>
     </div>
     </div>
     
    
      
     
  );
};

export default UserDashboard;
