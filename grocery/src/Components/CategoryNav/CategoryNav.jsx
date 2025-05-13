import React, { useEffect, useState} from 'react';
import './CategoryNav.css';
import categoryService from '../../Services/categoryService';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation


const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize useNavigate


  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.log('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);
      
  const handleCategoriesClick = (cid) =>{
    navigate(`/admin/allProducts/${cid}`)
  }
 
 
};

export default CategoryNav;
