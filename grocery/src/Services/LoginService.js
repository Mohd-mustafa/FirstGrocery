import axios from 'axios';
import axiosInstance from './axiosInstance';
 
const baseUrl = 'http://localhost:8081/auth'; // Adjust this as needed
const baseUrl2 = 'http://localhost:8081/social'; // Adjust this as needed
const baseUrl3= 'http://localhost:8081/api/user'

const LoginService = {
 
  // Generate token
  async generateToken(loginData) {
    try {
      const response = await axios.post(`${baseUrl}/login`, loginData);       
      return response.data; 
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  },

  // Set token in localStorage
  loginUser(token) {
    localStorage.setItem('token', token);
    return true;
  },

  // Check if user is logged in
  isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== undefined && token !== '' && token !== null;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('jwtHeader');
    return true;
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

   

  // Get user details from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  },

   // Get user details from localStorage
   getUserOfGoogle() {
    const userStr = localStorage.getItem('jwtHeader');
    if (userStr) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  },
  // Get decoded JWT header from localStorage
  getDecodedJwtHeader() {
    const headerStr = localStorage.getItem('jwtHeader');
    if (headerStr) {
      return JSON.parse(headerStr);
    } else {
      console.warn('No JWT header found in localStorage.');
      return null;
    }
  },

  // Get current logged-in user
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(`${baseUrl3}/current-user`)
      console.log(response)

      return response.data;
 
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Get user role
  getUserRole() {
    const user = this.getUser();
    if (user && user.roles.length > 0) {
      return user.roles[0]?.nameRole; // Accessing the nameRole property
    } else {
      console.warn('No roles found for the user.');
      return null;
    }
 
  }
};

export default LoginService;
