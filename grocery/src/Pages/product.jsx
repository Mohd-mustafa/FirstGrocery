import React, { useEffect, useState } from 'react'
import CategoryService from '../Services/categoryService';
import './product.css'

const product = () => {
      
    const [categories,setCategories]=useState([]);
    const [selectedCategory, setSelectedCategory]=useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(()=>{
        const fetchCategories=async () =>{
            try{
                const data=await CategoryService.getAllCategories();
                setCategories(data);
                console.log(data)
            }catch(error){
                setError('Failed to load categories');

            }finally{
                setLoading(false);

            }
        };fetchCategories()
    },[]);

   
  return (
    <div>
    <h2>All Categories</h2>
    {loading && <p>Loading...</p>}
    {error && <p>{error}</p>}
    
    <div className="category-grid">
      {categories.map((category) => (
        <div key={category.id} className="category-card">
           <div className="product-list">
            {category.products && category.products.length > 0 ? (
              <ul>
                {category.products.map((product) => (
                  <li key={product.id}>{product.name}</li>
                ))}
              </ul>
            ) : (
              <p>No products available for this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
    )
}

export default product