import { TbBrandMeta } from 'react-icons/tb'
import { CiTwitter } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { Link } from 'react-router-dom';
const TopBar = () => {
    return (
        <div className='bg-[#ea2e0e] text-white'>
            <div className='container mx-auto flex justify-between items-center py-3 px-4 '>
                <div className='hidden items-center space-x-4 md:flex'>
                    <Link to='/'> <CiInstagram /> </Link>
                    <Link to='/'> <CiTwitter /> </Link>
                    <Link to='/'> <TbBrandMeta /> </Link>
                </div>
                <div className='text-sm text-center flex-grow'>
                    <span>We Ship worldwide Fast and reliable shipping</span>
                </div>
                <div className='text-sm hidden md:block'>
                    <Link > tel:123456789</Link>
                </div>
            </div>
        </div>
    )
}

export default TopBar