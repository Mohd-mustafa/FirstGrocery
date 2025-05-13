import React, { useState ,useEffect} from 'react'
 import './ListOfCategories.css'
import categoryService from '../../Services/categoryService'
import { useNavigate } from 'react-router-dom'

 const ListOfCategories = () => {
          
    const [categories,setCategories]=useState([])
    const [error, setError]=useState(null);
    const [message, setMessage]=useState(null);

    const navigate=useNavigate();
     
    const handleAddSubCategoryClick=(id) =>{
        navigate(`/admin/createSubCategory`)
    }


     useEffect(() =>{
        const fetchCategories =async () =>{
            try{
                const data=await categoryService.getAllCategories();
                setCategories(data)
                console.log(data)
    
            }catch(error){
                setError("Failed to fetch the categories",error)
            }
        };fetchCategories()
     },[])

    const handleDelete = async(id) =>{
        const success =await categoryService.deleteCategory(id);
        if(success){
            setCategories(categories.filter(category => category.cid !== id));
            setMessage('Category deleted successfully');
        } else {
          setMessage('Failed to delete category');
        }
       }

    const handleButtonOnClick = async (cid) =>{
        navigate(`/allProducts/${cid}`)
    }
    

  return (
    <div className="card-container">
    {categories.map(category => (
      <div
       key={category.id}
       className="card" 
       onClick={() => handleButtonOnClick(category.cid)}>
        <img src={category.imageUrl} alt={category.name} className="card-image" />
        <h3 className="card-name">{category.name}</h3>
        
        <div className='button-section'>
        <button
         className='btn-add'
         onClick={(e)  =>{
          e.stopPropagation();
          handleAddSubCategoryClick(category.cid);
         }}>
         Add SubCategory
         </button>
        
        <button
        className='btn-delete'
         onClick={(e) =>{
          e.stopPropagation();
          handleDelete(category.cid)
         }}
         >
        Delete Category
        </button>
        
        </div>
      </div>
      
    ))}
 

    <div>
     </div>
  </div>  )
}

export default ListOfCategories 