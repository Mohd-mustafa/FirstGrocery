 import React, { useEffect, useState } from 'react'
 import fruits from '../../assets/apple.jpeg'
 import { Link, useParams } from 'react-router-dom';
 import './AllProducts.css'
 import categoryService from '../../Services/categoryService';
import subCategoryService from '../../Services/subCategoryService';
import product from '../product';
import productService from '../../Services/productService';

 
 const AllProducts = () => {
      
    const[categories,setCategories]=useState([]);
    const[products,setProducts]=useState([])
    const [selectedCategory, setSelectedCategory] = useState(null); // To keep track of selected category
    const {cid}=useParams();

     useEffect(()=>{
        const fetchCategories= async ()=>{
           try{
            const response=await subCategoryService.getSubCategoriesByCategoryId(cid);
            console.log(response)
            setCategories(response); 

           }catch(error){
              console.log(error)
           }
        };fetchCategories()
     },[])

     const handleCategoriesClick=(category) =>{
      setSelectedCategory(category)
     }

     const handleEditProduct= async(product)=>{

     }
     const handleDeleteProduct = async (productId) => {
      try {
        await productService.deleteProduct(productId); // Call your delete API
        setSelectedCategory((prevCategory) => ({
          ...prevCategory,
          products: prevCategory.products.filter(product => product.id !== productId),
        }));
        console.log("Product deleted:", productId);
      } catch (error) {
        console.log("Error deleting product:", error);
      }
    };

   return (     
    <div className='admin-product-container'>
    <div className="sidebar-all-products">
           
       <nav className="sidebar-nav">
        <ul>
          {categories.map((category)=>(
             <li key={category.id} onClick={() => handleCategoriesClick(category)}>
             <Link to={`#${category.name.toLowerCase()}`}>
             <img src={category.imageUrl} alt={category.name} />
             </Link>
             <p>{category.name}</p>
              </li>
          ))}        
        </ul>
      </nav>
    </div>  
       <div className='main-content'>
        {selectedCategory && selectedCategory.products.length > 0 ? (
          selectedCategory.products.map((product)=>(
            <div className='admin-product-card' key={product.id}>
            <img src={product.imageUrl || 'default_product_image.jpg'} alt={product.name} />
            <h4>{product.name}</h4>
            <p>Qty: {product.quantity || 'N/A'}</p>
            <div className='price'>
              <p>{product.price}</p> <span>{product.discountPrice}</span>
            </div>
            <div className='button'>
              <button className='admin-btn-edit' onClick={() => handleEditProduct(product)}>Edit</button>
              <button className='admin-btn-delete' onClick={()=> handleDeleteProduct(product.id)}>Delete</button>
            </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
  </div>
  
   )
 }
 
 export default AllProducts