import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import categoryService from '../../../Services/categoryService'; 

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Fetch categories and set the first category as selected
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        const fetchedCategories = response; // Ensure this response matches your data structure
        setCategories(fetchedCategories);

        // Set the first category as the selected category initially
        if (fetchedCategories.length > 0) {
          const initialCategoryId = fetchedCategories[0].cid;
          setSelectedCategoryId(initialCategoryId);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when the selected category changes
  useEffect(() => {
    const fetchProducts = () => {
      if (!selectedCategoryId) return;

      const selectedCategory = categories.find(
        (category) => category.cid === selectedCategoryId
      );

      if (selectedCategory) {
        setProducts(selectedCategory.products || []); // Set products or empty array if none found
      }
    };

    fetchProducts();
  }, [selectedCategoryId, categories]);

  const incrementQuantity = (id) => {
    setCartQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const decrementQuantity = (id) => {
    setCartQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 0) - 1, 0),
    }));
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="sidebar-menu">
          {categories.map((category) => (
            <li
              className={`sidebar-item ${selectedCategoryId === category.cid ? 'active' : ''}`}
              key={category.cid}
              onClick={() => setSelectedCategoryId(category.cid)}
            >
              <img src={category.imageUrl} alt={category.name} className="sidebar-image" />
              <span className="sidebar-text">{category.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => {
              const discountedPrice = product.price - (product.price * product.discount) / 100;
              return (
                <div className="product-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-weight">{product.weight}</p>
                    <p className="product-price">
                      <span className="discounted-price"></span>
                      <span className="original-price">₹{product.discountPrice}</span>
                    </p>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => decrementQuantity(product.id)}
                        disabled={(cartQuantities[product.id] || 0) <= 0}
                      >
                        -
                      </button>
                      <span className="quantity-count">
                        {cartQuantities[product.id] || 0}
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() => incrementQuantity(product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
