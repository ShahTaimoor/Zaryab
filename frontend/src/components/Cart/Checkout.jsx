
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [checkoutId, setCheckoutId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);
    
    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });

    // Ensure cart is loaded and has products
    useEffect(() => {
        if (!cart?.products?.length) {
            navigate('/');
        }
    }, [cart, navigate]);

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setOrderError(null);
        
        try {
            // Create checkout
            const response = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "COD",
                totalPrice: cart.totalPrice
            })).unwrap();

            if (response._id) {
                setCheckoutId(response._id);
                // For COD, immediately finalize
                await handleFinalizeCheckout(response._id);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            setOrderError(error.message || "Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, 
                {}, // Empty body for COD
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                    }
                }
            );
           
            
            navigate('/order-confirmation');
        } catch (error) {
            console.error("Finalization error:", error);
            throw error;
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cart?.products?.length) {
        return <p>Your Cart is empty</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left section - Shipping Form */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">CheckOut</h2>
                
                {orderError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {orderError}
                    </div>
                )}
                
                <form onSubmit={handleSubmitOrder}>
                    {/* ... rest of your form fields remain the same ... */}
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            disabled
                            className="w-full p-2 border rounded"
                            type="email"
                            value={user ? user.email : ''}
                        />
                    </div>

                    <h3 className="text-lg mb-4">Delivery Information</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="number"
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition ${
                                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right section - Order Summary remains the same */}
            {/* ... */}

            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-4">
                    {cart.products.map((product, index) => (
                        <div className="flex items-start justify-between py-2 border-b" key={index}>
                            <div className="flex items-start">
                                <img
                                    className="w-20 h-24 object-cover mr-4"
                                    src={product.image}
                                    alt={product.name}
                                />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">${product.price?.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center text-lg mb-4">
                    <p>SubTotal</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;