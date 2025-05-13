import axiosInstance from './axiosInstance.js'

const API_URL = 'http://localhost:8081/api/products';  // Replace with your actual API base URL

const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Re-throwing the error to handle it in the component if needed
    }
};

const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

const createProduct = async (product) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/addProducts`, product);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

const updateProduct = async (id, product) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/update/${id}`, product);
        return response.data;
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

const deleteProduct = async (id) => {
    try {
        await axiosInstance.delete(`${API_URL}/delete/${id}`);
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};

const getCategoryWithProducts = async (cid) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${cid}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting products with categoryId ${cid}:`, error);
        throw error;
    }
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategoryWithProducts
};
