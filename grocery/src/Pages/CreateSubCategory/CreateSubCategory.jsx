import React, { useState, useEffect } from 'react';
import SubCategoryService from '../../Services/subCategoryService';
import categoryService from '../../Services/categoryService';
import axiosInstance from '../../Services/axiosInstance';
import './CreateSubCategory.css'; // Import the CSS file for styling

const API_URL = 'http://localhost:8081/api/subcategories'; // Replace with your backend URL

const CreateSubCategory = () => {
  const [subCategory, setSubCategory] = useState({
    name: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response); // Adjust based on your API response structure
       } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCat = categories.find((cat) => cat.cid === parseInt(categoryId));
    setSelectedCategory(selectedCat);
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
    try {
      if (!subCategory.name || !selectedCategory) {
        alert('Please fill in all the fields');
        return;
      }

      const subCategoryData = {
        name: subCategory.name,
        imageUrl: subCategory.imageUrl,
        categoryId: selectedCategory.cid
      };

      const response = await SubCategoryService.createSubCategory(subCategoryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const savedSubCategory = response;
 
      
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('id', savedSubCategory.id);

        await axiosInstance.post(`${API_URL}/upload-image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setMessage('SubCategory added successfully with the image');
      setMessageType('success');
      setSubCategory({ name: '', imageUrl: '' });
      setSelectedCategory(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error adding SubCategory:', error);
      setMessage('Failed to add SubCategory.');
      setMessageType('error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
         <div className='create-subcategory-container'>
               <h2>Add new Subcategory</h2>
               <form onSubmit={handleSubmit} className='subcategory-form '>
                <div className='form-group'>
                  <label htmlFor='name'>
                   SubCategory Name
                  </label>
                  <input 
                  type='text'
                  name='name'
                  value={subCategory.name}
                  onChange={handleChange}
                  placeholder='Enter Subcategory name'
                  className='form-control'
                  required
                  />
                </div>
                 <div className='form-group'>
                 <label htmlFor='category'>Select Category</label>
                 <select onChange={handleCategoryChange} className='form-control' required>
                     <option value="">Choose a category</option>
                     {
                        categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.cid} value={category.cid}>
                                    {category.name}
                                </option>
                            ))
                        ):(
                            <option disabled>
                              No Categories available
                            </option>
                        )
                     }
                 </select>
                 </div>
                    <div className='form-group'>
                      <label htmlFor='image'>Upload Image</label>
                      <input type='file' onChange={handleImageChange} className='form-control-file'/>
                     </div>

                    <button type='submit' className='submit-btn'>Create Sub Category</button>
                    {message && <p className={`message ${messageType}`}>{message} </p>}
               </form>
        </div> 
     
);
};

export default CreateSubCategory;
