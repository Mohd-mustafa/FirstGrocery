// categoryApi.js
import axiosInstance from './axiosInstance'; // Import the axiosInstance



const API_URL = 'http://localhost:8081/api/categories';

// Add Category function
const addCategory = async (category) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/addCategory`, category);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

// Get all Categories function
const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/getAllCategories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return []; // Return empty array in case of error
    }
};

// Get Category by ID function
const getCategoryById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/getCategory/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

// Update Category function
const updateCategory = async (id, category) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${id}:`, error);
        throw error;
    }
};

// Delete Category function
const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        if (response.status === 204) {
            console.log(`Category with ID ${id} deleted successfully`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        return false;
    }
};

export default {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
