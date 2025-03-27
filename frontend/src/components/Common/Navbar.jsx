import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2'
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';
import { useSelector } from 'react-redux';
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const cartItemsCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen)
  }

  return (
    <>
      <nav className='container py-4 px-6 mx-auto flex items-center justify-between'>
        <div>
          <Link className='text-2xl font-medium' to='/'>Zaryab Auto</Link>
        </div>

        <div className='hidden md:flex space-x-6'>

          <Link to='/collections/all?gender=Men' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
            Men
          </Link>
          <Link to='/collections/all?gender=Women' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
            Women
          </Link>
          <Link to='/collections/all?category=Top Wear' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
            Top Wear
          </Link>
          <Link to='/collections/all?category=Bottom Wear' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
            Bottom Wear
          </Link>
        </div>


        <div className='flex items-center space-x-4'>
          {user && user.role === 'admin' && (<Link to='/admin' className='block bg-black px-2 rounded text-sm text-white'>
            Admin
          </Link>)}
          <Link to='/profile' className='hover:text-black'>
            <HiOutlineUser className='h-5 w-5' />
          </Link>
          <button onClick={toggleCartDrawer} className='relative hover:text-black'>
            <HiOutlineShoppingBag className='h-5 w-5' />
            {cartItemsCount > 0 && (<span className='bg-red-600 absolute -top-2 text-white rounded-full px-2 py-0.5 text-xs'>{cartItemsCount}</span>)}

          </button>

          <div className='overflow-hidden'>
            <SearchBar />
          </div>

          <button className='md:hidden' onClick={toggleNavDrawer}>
            <HiBars3BottomRight className='h-5 w-5' />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigation */}

      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'} bg-white`}>
        <div className='flex justify-end p-4'>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className='h-5 w-5' />
          </button>
        </div>

        <div className='p-4 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Menu</h2>
          <nav className='space-y-4'>
            <Link to='/collections/all?gender=Men' onClick={toggleNavDrawer} className='text-gray-700 block hover:text-black text-sm font-medium uppercase' >
              Men
            </Link>
            <Link to='/collections/all?gender=Women' onClick={toggleNavDrawer} className='text-gray-700 block hover:text-black text-sm font-medium uppercase' >
              Women
            </Link>
            <Link to='/collections/all?category=Top Wear' onClick={toggleNavDrawer} className='text-gray-700 block hover:text-black text-sm font-medium uppercase' >
              Top Wear
            </Link>
            <Link to='/collections/all?category=Bottom Wear' onClick={toggleNavDrawer} className='text-gray-700 block hover:text-black text-sm font-medium uppercase' >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>

    </>
  )
}

export default Navbar