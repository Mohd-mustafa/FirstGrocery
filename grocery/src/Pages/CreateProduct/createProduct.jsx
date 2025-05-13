import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Services/axiosInstance';
import categoryService from '../../Services/categoryService';
import subCategoryService from '../../Services/subCategoryService';
import './createProduct.css';

const API_URL = 'http://localhost:8081/api/products'; // Replace with your backend URL

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    discountPrice: '',
    quantity: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchCategoriesAndSubCategories = async () => {
      try {
        const categoryResponse = await categoryService.getAllCategories();
        setCategories(categoryResponse); // Adjust based on your API response structure

        if (selectedCategory) {
          const subCategoryResponse = await subCategoryService.getSubCategoriesByCategoryId(selectedCategory.cid);
          setSubCategories(subCategoryResponse); // Adjust based on your API response structure
        }
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
        setError('Error fetching categories or subcategories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndSubCategories();
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCat = categories.find(cat => cat.cid === parseInt(categoryId));
    setSelectedCategory(selectedCat || null);
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    const selectedSubCat = subCategories.find(cat => cat.id === parseInt(subCategoryId));
    setSelectedSubCategory(selectedSubCat || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || selectedCategory.cid === "undefined") {
      setMessage("Please select a valid category.");
      return;
    }
  
    // Ensure subCategoryId is either a valid ID or null
    if (selectedSubCategory && selectedSubCategory.id === "undefined") {
      setMessage("Please select a valid subcategory.");
      return;
    }

    try {
      if (!product.name || !product.description || !product.price || !selectedCategory || !product.discountPrice || !product.quantity) {
        setMessage('Please fill in all the fields.');
        setMessageType('error');
        return;
      }

      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: product.quantity,
        imageUrl: product.imageUrl,
        categoryId: selectedCategory.cid === "undefined" ? null : selectedCategory.cid,
    subCategoryId: selectedSubCategory ? (selectedSubCategory.id === "undefined" ? null : selectedSubCategory.id) : null,  };

      const response = await axiosInstance.post(`${API_URL}/addProduct`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const savedProduct = response.data;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('id', savedProduct.productId);

        await axiosInstance.post(`${API_URL}/upload-image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setMessage('Product added successfully with the image.');
      setMessageType('success');
      setProduct({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        discountPrice: '',
        quantity: '',
      });
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setImagePreview('');
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Failed to add product. Please try again.');
      setMessageType('error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="discountPrice">Discount Price ($)</label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={product.discountPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={selectedCategory ? selectedCategory.cid : ''}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select a Category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.cid} value={category.cid}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="subCategory">SubCategory</label>
              <select
                id="subCategory"
                name="subCategory"
                value={selectedSubCategory ? selectedSubCategory.id : ''}
                onChange={handleSubCategoryChange}
                required
              >
                <option value="">Select a SubCategory</option>
                {subCategories.length > 0 ? (
                  subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))
                ) : (
                  <option value="">No SubCategories available</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="imageUrl">Product Image</label>
              <input
                type="file"
                id="imageUrl"
                name="imageUrl"
                accept="image/*"
                onChange={handleImageChange}
              />
             </div>
          </div>
        </div>

        <button type="submit" className="submit-button">Add Product</button>

        {message && (
          <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;
