import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSignHanging, FaStore, FaUser } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice'
import { clearCart } from '../../redux/slices/cartSlice'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
      dispatch(logout())
      dispatch(clearCart())
        navigate('/')
    }
    return (
        <div className='p-6'>
            <div className='mb-6'>
                <Link to='/admin' className='text-22xl font-medium'>
                    Zaryab Auto</Link>
            </div>
            <h2 className='text-xl font-medium mb-6 text-center'>Admin Dashboard</h2>
            <nav className='flex flex-col space-y-2'>
                <NavLink to='/admin/users' className={({ isActive }) => isActive ?
                    'bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 '
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 '}>
                    <FaUser />
                    <span>Users</span>
                </NavLink>
                <NavLink to='/admin/products' className={({ isActive }) => isActive ?
                    'bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 '
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 '}>
                    <FaBoxOpen />
                    <span>Products</span>
                </NavLink>
                <NavLink to='/admin/orders' className={({ isActive }) => isActive ?
                    'bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 '
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 '}>
                    <FaClipboardList />
                    <span>Order</span>
                </NavLink>
                <NavLink to='/' className={({ isActive }) => isActive ?
                    'bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 '
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 '}>
                    <FaStore />
                    <span>Shop</span>
                </NavLink>
            </nav>

            <div className='mt-6'>
                <button
                    className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2'
                    onClick={handleLogout}>
                    <FaSignHanging />
                   <span> Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar