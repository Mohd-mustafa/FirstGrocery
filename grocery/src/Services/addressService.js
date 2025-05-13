import axios from './axiosInstance.js'

const baseUrl = 'http://localhost:8081/api/addresses'; // Adjust this as needed

const addAddress = async (addressData,id) => {
    try{
        const response=await axios.post(`${baseUrl}/create/1`,addressData);
        return response.data;
    }catch(error){
        console.error('Error adding address:', error);
        throw error; // Rethrowing the error for further handling
    }
}

export default{
    addAddress,
}