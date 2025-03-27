import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../assets/login.webp'
import { loginUser } from '../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'
import { toast } from 'sonner'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const { user, guestId,loading } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)

    const redirect = new URLSearchParams(location.search).get('redirect')
    const isCheckoutRedirect = redirect?.includes('checkout');

    useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? '/checkout' : '/')
                })
            } else {
                navigate(isCheckoutRedirect ? '/checkout' : '/')
            }
        }
    }, [user, guestId, cart?.products?.length, navigate, isCheckoutRedirect, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(loginUser({ email, password })).unwrap()
            toast.success("Login successful!", { position: "top-right" })
        } catch (err) {
            if (err?.message === "Invalid email or password") {
                toast.error("Incorrect email or password", { position: "top-right" })
            } else {
                toast.error(err?.message || "Something went wrong. Please try again.", { position: "top-right" })
            }
        }
    }

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm ' >
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Zaryab Auto</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey There!</h2>
                    <p className='text-center mb-6'>
                        Enter your email and password to login
                    </p>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter Your Email Address'
                        />
                    </div>

                    {/* Fixed Password Field */}
                    <div className='mb-4 relative'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full p-2 border rounded pr-10'
                                placeholder='Enter Your Password'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {showPassword ? <FaRegEye /> :  <FaRegEyeSlash />}
                            </button>
                        </div>
                    </div>

                    <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
                        {loading ? "loading" : "Sign In"}
                    </button>
                    <p className='mt-6 text-center text-sm'> Don't have an account?
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'> Register</Link>
                    </p>
                </form>
            </div>

            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={login} alt="Login to Account" className='h-[750px] w-full object-cover' />
                </div>
            </div>
        </div>
    )
}

export default Login
