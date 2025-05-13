import React from 'react'
import Navbar from '../../Components/NavBar/Navbar'
import UserDashboard from '../User-dashboard/UserDashboard'
import CategoryNav from '../../Components/CategoryNav/CategoryNav'

const UserLayout = () => {
  return (
    <div>
        <Navbar/>
         <UserDashboard/>
        
    </div>
  )
}

export default UserLayout