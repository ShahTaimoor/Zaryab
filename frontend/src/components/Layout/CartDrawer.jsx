import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate()

    const { user, guestId } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user._id : null

    const handleCheckout = () => {
        toggleCartDrawer()
        if (!user) {
            navigate('/login?redirect=checkout')
        } else {
            navigate('/checkout')
        }
    }


    return (
        <div className={`fixed top-0 right-0  sm:w-1/2 md:w-[30rem]  h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? 'translate-x-0 ' : 'translate-x-full'}`}>

            <div className='flex justify-end p-4 '>
                <button onClick={toggleCartDrawer}>
                    <IoMdClose />
                </button>
            </div>

            {/* cart content with scrollbar area */}
            <div className="flex-grow p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                {/* component cart content */}
                {cart && cart?.products?.length > 0 ? (<CartContent cart={cart} userId={userId} guestId={guestId} />)
                    : (<p>Your Cart is empty</p>)}

            </div>

            {/* checkout button fixed */}

            {cart && cart?.products?.length > 0 && <>
                <div className="p-4 bg-white sticky bottom-0">
                    <button onClick={handleCheckout} className="w-full transition-all bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">Checkout</button>
                    <p className="text-sm tracking-tighter  text-gray-500 mt-2 text-center">
                        shipping ,texas and discount codes calculated
                    </p>
                </div>
            </>}

        </div>
    )
}

export default CartDrawer