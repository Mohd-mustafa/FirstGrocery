import React, { useState } from 'react';
import categoryService from '../../Services/categoryService';
import './createCategory.css'
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/categories'; // Replace with your backend URL

const createCategory = () => {
      const[category,setCategory]=useState({
        name:'',
        description:'',
        imageUrl:null

      });      

      const [message,setMessage]=useState('');
      const [messageType, setMessageType] = useState(''); // Can be 'error' or 'success'

      const handleChange = (e) =>{
        const {name,value} = e.target;
        setCategory((prevState) =>({
            ...prevState,
            [name]:value,
        }))
      };

      const handleFileChange = (e) =>{
        setCategory({
            ...category,
            imageUrl:e.target.files[0],
        });
      }

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', category.name);
            formData.append('description', category.description);
            formData.append('file', category.imageUrl); // Use 'file' if that's the key your backend expects
    
            // First, send the category and image together
            const response = await axios.post(`${API_URL}/addCategory`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This tells the server that you're sending form data
                },
            });
    
            // Assuming your backend returns the category ID
            const categoryId = response.data.cid;
    
            // Optionally handle the image upload separately if needed
            // (in this case, it might not be necessary since it's already included)
            
            setMessage('Category and image uploaded successfully');
            setMessageType('success');
            setCategory({
                name: '',
                description: '',
                imageUrl: null,
            });
        } catch (error) {
            console.error('There was an error!', error);
            setMessage('An error occurred while adding the category.');
            setMessageType('error');
        }
    };
    
  return (
    <div className="category-form-container">
    <h2>Add New Category</h2>
    {message && (
      <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
        {message}
      </p>
    )}
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={category.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={category.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="image">Select Image</label>
        <input
          type="file"
          id="image"
          name="imageUrl"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit">Add Category</button>
    </form>
  </div>
  
  )
}

export default createCategory