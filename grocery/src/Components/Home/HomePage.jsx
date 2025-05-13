import React from 'react';
import Navbar from '../NavBar/Navbar';
import CategoryNav from '../CategoryNav/CategoryNav';
import OffersPage from '../../Pages/OffersPage/OffersPage';
import Product from '../../Pages/product';
import './HomePage.css'; // Import the CSS file
import ListOfCategories from '../../Pages/ListOfCategories/ListOfCategories';
import AllProducts from '../../Pages/AllProductsPage/AllProducts';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar Section */}
      <Navbar />

      {/* Category Navigation Section */}
      <CategoryNav />
      <OffersPage/>
      
      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 Your Website Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
