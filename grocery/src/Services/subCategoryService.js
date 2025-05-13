 import axiosInstance from './axiosInstance.js'

const API_URL = 'http://localhost:8081/api/subcategories'; 

const getAllSubCategories =async () =>{
    try{
        const response=await axiosInstance.get(API_URL);
        return response.data;
    } catch(error){
        console.error('Error fetching products:', error);
        throw error; // Re-throwing the error to handle it in the component if needed
    }
}

    const getSubCategoryById = async (id) =>{
        try{
            const response=await axiosInstance.get(`${API_URL}/id`);
            return response.data;
        }catch(error){
            console.error(`Error fetching subcategory with id ${id}:`, error);
            throw error;
        }
    }

    const createSubCategory= async (subCategory) =>{
        try{
            const response =await axiosInstance.post(`${API_URL}/addSubCategory`,subCategory);
            return response.data;
        }catch(error){
            console.error('Error creating product:', error);
            throw error;
        }
    }
     
    const updateSubCategory =async (id,subCategory) =>{
        try{
            const response =await axiosInstance.put(`${API_URL}/update/${id}`,subCategory);
            return response.data;
        }catch(error){
            console.error(`Error updating subCategory with id ${id}:`, error);
            throw error;
        }
    }

    const deleteSubCategory =async(id) =>{
        try{
            await axiosInstance.delete(`${API_URL}/delete/${id}`);

        }catch(error) {
            console.error(`Error deleting subCategory with id ${id}:`, error);
            throw error;
        }
    }

    const getSubCategoriesByCategoryId= async (id) =>{
        try{
            const response=await axiosInstance.get(`${API_URL}/category/${id}`)
            return response.data;
        }catch(error){
            console.error(`Error getting subCategory with id ${id}:`, error);
            throw error;
        }
    }
    
export default {
    getAllSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSubCategoriesByCategoryId   
};