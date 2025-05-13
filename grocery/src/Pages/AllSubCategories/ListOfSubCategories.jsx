 import React, { useState ,useEffect} from 'react'
 import './ListOFSubCategories.css'
import subCategoryService from '../../Services/subCategoryService'
import { useNavigate } from 'react-router-dom'

const ListOfSubCategories = () => {
    const navigate=useNavigate();

   
     const[subCategories,setSubCategories]=useState([]);
      useEffect(() =>{
       const fetchSubCategories =async () =>{
          try{
            const response=await subCategoryService.getAllSubCategories();
            setSubCategories(response);
            console.log(response)
          }catch(error){
            console.log(error)
          }
       };fetchSubCategories();
    },[]        
      )   
    
      const handleDelete = async(id) =>{
         const success=await subCategoryService.deleteSubCategory(id);
         if(success){
            setSubCategories(subCategories.filter(subCategory => subCategory.id !=id));
            setMessage('Category deleted successfully');
         }else{
            setMessage('Failed to delete category');
         }
      } 

      const handleAddProductClick=(id) =>{
        navigate(`/admin/createProduct`)
    }   
  

  return (
    <div className="subcategory-card-container">
    {subCategories.map(subCategory => (
      <div
        key={subCategory.id}
        className="subcategory-card"
        onClick={() => handleButtonOnClick(subCategory.id)}
      >
        <div className="subcategory-image-wrapper">
          <img src={subCategory.imageUrl} alt={subCategory.name} className="subcategory-image" />
        </div>
        
        <div className="subcategory-content">
          <h3 className="subcategory-name">{subCategory.name}</h3>
        
          <div className="subcategory-actions">
            <button
              className="subcategory-btn-add"
              onClick={(e) => {
                e.stopPropagation();
                handleAddProductClick(subCategory.id);
              }}
            >
              Add Product
            </button>

            <button
              className="subcategory-btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(subCategory.id);
              }}
            >
              Delete Category
            </button>
          </div>
        </div>
      </div>
    ))}

    <div></div>
</div>

   
)
}

export default ListOfSubCategories