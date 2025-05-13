import React, { useState, useCallback, useEffect } from 'react';
import './ProductPage.css';
import blueberry from '../../assets/blueberry.jpeg';
import fastdelivered from '../../assets/fast-delivered.png'; 
import bestprice from '../../assets/best-price.jpeg';
import wideassorment from '../../assets/wide-assorment.jpg';
import { useCart } from '../../User-section/User-dashboard/CartContext';
import { useParams } from 'react-router-dom';
import productService from '../../Services/productService';

const ProductPage = () => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { cart, setCart } = useCart(); 
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  console.log(id)
  const [product, setProduct] = useState(null);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    const x = Math.min(Math.max(0, offsetX), width);
    const y = Math.min(Math.max(0, offsetY), height);

    setZoomPosition({ x, y });
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);

      const totalItemCount = Object.values(parsedCart).reduce(
        (total, item) => total + item.quantity,
        0
      );
      setItemCount(totalItemCount);
    }
  }, [setCart]);

  useEffect(() => {
    if (cart && Object.keys(cart).length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Fetch product details based on the id from URL params
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.name]) {
        newCart[product.name].quantity += 1;
      } else {
        newCart[product.name] = { ...product, quantity: 1 };
      }

      const totalItemCount = Object.values(newCart).reduce(
        (total, item) => total + item.quantity,
        0
      );
      setItemCount(totalItemCount);
      return newCart;
    });
  };

  const decrementQuantity = useCallback((product, event) => {
    if (event) event.stopPropagation();

    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[product.name] && newCart[product.name].quantity > 1) {
        newCart[product.name].quantity -= 1;
      } else if (newCart[product.name] && newCart[product.name].quantity === 1) {
        delete newCart[product.name];
      }

      const totalItemCount = Object.values(newCart).reduce(
        (total, item) => total + item.quantity,
        0
      );
      setItemCount(totalItemCount);

      
      if (Object.keys(newCart).length === 0) {
        localStorage.removeItem('cart'); // Clear localStorage if cart is empty
      }


      return newCart;
    });
  }, [setCart]);

  const incrementQuantity = (product) => {
    setCart((prevCart) => {
      if (prevCart[product.name]) {
        return {
          ...prevCart,
          [product.name]: {
            ...prevCart[product.name],
            quantity: prevCart[product.name].quantity + 1,
          },
        };
      }
      return prevCart;
    });

    const totalItemCount = Object.values(cart).reduce(
      (total, item) => total + item.quantity,
      0
    );
    setItemCount(totalItemCount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="left-image-container">
        <img
          src={product.imageUrl}
          alt="Product"
          className="product-image"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        />
        {isHovering && (
          <div
            className="magnifier-box"
            style={{
              top: `${zoomPosition.y - 20}px`,
              left: `${zoomPosition.x - 20}px`,
            }}
          ></div>
        )}

        <div className="similar-images">
          <img src={product.imageUrl} alt="Product" className="images" />
          <img src={blueberry} alt="Product" className="images" />
          <img src={blueberry} alt="Product" className="images" />
          <img src={blueberry} alt="Product" className="images" />
          <img src={blueberry} alt="Product" className="images" />

          {/* Add other similar images here */}
        </div>
      </div>

      <div className="right-zoom-container">
        {isHovering && (
          <img
            src={product.imageUrl}
            alt="Zoomed Product"
            className="zoomed-image"
            style={{
              transform: `scale(2) translate(-${zoomPosition.x / 1}px, -${zoomPosition.y / 1}px)`,
            }}
          />
        )}
        <div className="product-details-section">
          <div className="price-section">
            <h2>{product.name}</h2>
            <div className="price-rates">
              <div className="rateandweight">
                <p className="product-quantity">{product.quantity} grms</p>
                <p className="product-discountPrice">
                  &#8377;{product.discountPrice} &nbsp;
                  <span className="product-price">MRP &#8377;{product.price}</span>
                </p>
              </div>
            </div>
            <div className="tax-section">
              <h2>(Inclusive of all taxes)</h2>
              {cart[product.name] ? (
              <div className="quantity-controls">
                <span
                  onClick={(event) => decrementQuantity(product, event)}
                  className="incredecre"
                >
                  -
                </span>
                <span className="quantity">
                  {cart && cart[product.name] ? cart[product.name].quantity : 0}
                </span>
                <span onClick={() => incrementQuantity(product)} className="incredecre">
                  +
                </span>
              </div>
            ) : (
              <button className="add-cart" onClick={() => addToCart(product)}>
                Add
              </button>
            )}
            </div>
            
          </div>
        </div>

        <div className="delivery-instruction">
          <h4>Why shop from our store</h4>
          <div className="instruction-item">
            <img src={fastdelivered} alt="fast-delivery" className="instruction-image" />
            <div className="delivery">
              <span className="delivery-heading">Fast Delivery:</span>
              <span>Enjoy quick delivery options to ensure you receive your order on time.</span>
            </div>
          </div>
          <div className="instruction-item">
            <img src={bestprice} alt="Best Quality" className="instruction-image" />
            <div className="quality-products">
              <span className="delivery-heading">Best Quality Products:</span>
              <span>We offer the highest quality products sourced from trusted suppliers.</span>
            </div>
          </div>
          <div className="instruction-item">
            <img src={wideassorment} alt="Wide Assortment" className="instruction-image" />
            <div className="assortment">
              <span className="delivery-heading">Wide Assortment:</span>
              <span>Choose from a wide range of premium products for all your needs.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
