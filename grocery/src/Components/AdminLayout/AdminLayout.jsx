import React from 'react'
import Navbar from '../NavBar/Navbar'
import { Outlet ,Link} from 'react-router-dom'
import CategoryNav from '../CategoryNav/CategoryNav'
import './AdminLayout.css'
import { FaPlusCircle, FaListAlt, FaTags, FaBox } from 'react-icons/fa'; // Import icons
import apple from '../../assets/apple.jpeg'

const AdminLayout = () => {
  const hideSidebar = location.pathname.startsWith('/admin/allProducts');

  return (
    <div>
        <Navbar/>
        <div className='admin-dashboard'>
  <div className='admin-sidebar'>
    <ul className='sidebar-menu'>
      <li className='sidebar-list'>
      <Link to="/admin/createCategory">
    <FaPlusCircle style={{ marginRight: '8px' }} className='icon' /> Add Category
  </Link>
      </li>
      <li className='sidebar-list'>
      <Link to="/admin/createSubCategory">
    <FaPlusCircle style={{ marginRight: '8px' }} className='icon' /> Add SubCategory
  </Link>
      </li>
      <li className='sidebar-list'>
        <Link to="/admin/createProduct">
          <FaBox style={{ marginRight: '8px' }}  className='icon'/> Add Product
        </Link>
      </li>
      <li className='sidebar-list'>
        <Link to='/admin/categories'>
          <FaTags style={{ marginRight: '8px' }} className='icon' /> All Categories
        </Link>
      </li>
      
      <li className='sidebar-list'>
        <Link to='/admin/subCategories'>
          <FaTags style={{ marginRight: '8px' }} className='icon' /> All SubCategories
        </Link>
      </li>
      <li className='sidebar-list'>
        <a href="#">
          <FaListAlt style={{ marginRight: '8px' }} className='icon' /> All Products
        </a>
      </li>
    </ul>
  </div>
  
  <div className='admin-main-menu'>
         <Outlet/>
</div>
     </div>
     </div>
  )
}

export default AdminLayout