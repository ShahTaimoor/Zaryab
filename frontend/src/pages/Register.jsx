import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import register from '../assets/register.webp'
import { registerUser } from '../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'
import { toast } from 'sonner'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, guestId,loading } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)

    const redirect = new URLSearchParams(location.search).get('redirect')
    const isCheckoutRedirect = redirect?.includes('checkout')

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
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long!", { position: "top-right" })
            return
        }

        try {
            await dispatch(registerUser({ name, email, password })).unwrap()
            toast.success("Registration successful!", { position: "top-right" })
        } catch (err) {
            toast.error(err?.message || "User already exists!", { position: "top-right" })
        }
    }

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm '>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Zaryab Auto</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey There!</h2>
                    <p className='text-center mb-6'>
                        Enter your details to register
                    </p>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter Your Name'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter Your Email Address'
                        />
                    </div>
                    <div className='mb-4 relative'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border rounded pr-10'
                            placeholder='Enter Your Password'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-gray-500"
                        >
                            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                        {password && password.length < 8 && (
                            <p className='text-red-500 text-xs mt-1'>Password must be at least 8 characters long</p>
                        )}
                    </div>
                    <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
                    {loading ? "loading..." : "Register"}
                    </button>
                    <p className='mt-6 text-center text-sm'> Already have an account?
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'> Sign In</Link>
                    </p>
                </form>
            </div>

            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={register} alt="Register to Account" className='h-[750px] w-full object-cover' />
                </div>
            </div>
        </div>
    )
}

export default Register
