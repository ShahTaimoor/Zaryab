import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeFromCart, updatedCartItemQuantity } from "../../redux/slices/cartSlice";
const CartContent = ({ cart, userId, guestId }) => {

    const dispatch = useDispatch()

    // handle adding or sutracting cart

    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta
        if (newQuantity >= 1) {
            dispatch(
                updatedCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                    size,
                    color
                })
            )
        }
    }

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(removeFromCart({ productId, size, color, guestId, userId }))
    }
    return (
        <div>
            {cart.products.map((product, index) => (
                <div key={index} className='flex items-start justify-between py-4 border-b'>
                    <div className='flex items-start'>
                        <img src={product.image} alt={product.name} className='w-20 h-20 object-cover mr-4 rounded' />

                        <div>
                            <h3>{product.name}</h3>
                            <p className='text-sm text-gray-500'>size: {product.size} | color: {product.color}</p>
                            <div className='flex items-center gap-2 mt-2'>
                                <button className='border rounded px-2   text-xl font-medium' onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}>-</button>
                                <span>{product.quantity}</span>
                                <button className='border rounded px-2  text-xl font-medium' onClick={() => handleAddToCart(product.productId, +1, product.quantity, product.size, product.color)}>+</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>${product.price.toLocaleString()}</p>
                        <button onClick={()=>handleRemoveFromCart(product.productId,product.size, product.color)}><MdDelete className="h-5 w-5 mt-2 text-red-600" /></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CartContent