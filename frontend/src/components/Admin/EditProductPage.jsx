import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails } from '../../redux/slices/productSlice'
import axios from 'axios'
import { updateProduct } from '../../redux/slices/adminProductSlice'

const EditProductPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { selectedProduct, loading, error } = useSelector((state) => state.products)
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        collections: '',
        material: '',
        gender: '',
        images: []
    })
    const [uploading, setUploading] = useState(false) //image uploading state

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id))
        }
    }, [dispatch, id])

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct)
        }
    }, [selectedProduct])



    const handleChange = (e) => {
        const { name, value } = e.target
        setProductData((prevData) => (
            {
                ...prevData, [name]: value
            }
        ))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData(); 
        formData.append('image', file);
    
        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`, 
                formData, 
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data', 
                        Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                    }
                }
            );
    
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: '' }],
            }));
    
            setUploading(false); // Reset state after successful upload
        } catch (error) {
            console.error(error);
            setUploading(false); // Ensure it resets on failure too
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await dispatch(updateProduct({ id, ...productData })); 
        
        navigate('/admin/products');
    };
    

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error:{error}</p>

     return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="border-b border-gray-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Edit Product</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Update product details below. All fields are required unless marked optional.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-8 divide-y divide-gray-200">
                        {/* Product Information */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={productData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={productData.price}
                                            onChange={handleChange}
                                            className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={productData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                {/* Inventory */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="countInStock"
                                        value={productData.countInStock}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                {/* SKU */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={productData.sku}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                {/* Sizes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sizes (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={productData.sizes.join(', ')}
                                        onChange={(e) => setProductData({ 
                                            ...productData, 
                                            sizes: e.target.value.split(',').map(s => s.trim()) 
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="S, M, L, XL"
                                    />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {productData.sizes.map((size, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Colors (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={productData.colors.join(', ')}
                                        onChange={(e) => setProductData({ 
                                            ...productData, 
                                            colors: e.target.value.split(',').map(c => c.trim()) 
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Red, Blue, Green"
                                    />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {productData.colors.map((color, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                            >
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="pt-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                                    
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleImageUpload}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                            {uploading && (
                                                <div className="mt-4">
                                                   
                                                    <p className="text-sm text-gray-500">Uploading...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Previews */}
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productData.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={image.url}
                                alt={image.altText || 'Product preview'}
                                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setProductData({
                                ...productData,
                                images: productData.images.filter((_, i) => i !== index)
                            })}
                            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="pt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default EditProductPage