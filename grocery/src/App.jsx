// App.js
import { useState,useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './Pages/product';
import CreateProduct from './Pages/CreateProduct/createProduct';
import CreateCategory from './Pages/Category/createCategory';
import HomePage from './Components/Home/HomePage';
import OffersPage from './Pages/OffersPage/OffersPage';
import ListOfCategories from './Pages/ListOfCategories/ListOfCategories';
import AllProducts from './Pages/AllProductsPage/AllProducts';
import Dashboard from './Components/User/Dashboard/Dashboard';
import UserLayout from './User-section/UserLayout/UserLayout';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import UserDashboard from './User-section/User-dashboard/UserDashboard';
import CreateSubCategory from './Pages/CreateSubCategory/CreateSubCategory';
import Navbar from './Components/NavBar/Navbar';
import ListOfSubCategories from './Pages/AllSubCategories/ListOfSubCategories';
import { CartProvider } from './User-section/User-dashboard/CartContext';
import ProductPage from './User-section/ProductPage/ProductPage';
import Login from './Pages/Login/Login';
import PaymentMethod from './Pages/PaymentMethod/PaymentMethod';
import Address from './Components/AddressUpdate/Address';
     
function App() {
 
   

  return (
     <CartProvider> {/* Wrap the entire app inside CartProvider */}
         <Navbar/>
          <Routes>
          <Route path='/home' element={<HomePage />} />
          <Route path='/login' element={<Login />} /> {/* Add the login route */}
          {/* User routes */}
          <Route path='/user' element={<UserLayout />}>
          <Route path='user-dashboard' element={<UserDashboard  />} />        
          </Route>
          <Route path='/product-page/:id' element={<ProductPage />} />
          <Route path='/checkOut/:id' element={<PaymentMethod />} />
          <Route path='/address/:id' element={<Address/>}/>
 
          {/* Admin routes */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='products' element={<Products />} />
            <Route path='offers' element={<OffersPage />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='categories' element={<ListOfCategories />} />
            <Route path='subCategories' element={<ListOfSubCategories />} />
            <Route path='createProduct' element={<CreateProduct />} />
            <Route path='createCategory' element={<CreateCategory />} />
            <Route path='createSubCategory' element={<CreateSubCategory />} />
          </Route>
          <Route path='allProducts/:cid' element={<AllProducts />} />
        </Routes>
     </CartProvider>
  );
}

export default App;
