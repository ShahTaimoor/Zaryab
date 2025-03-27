import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products, loading, error }) => {
    if (loading) return <p className='text-center text-gray-500 animate-pulse'>Loading...</p>
    if (error) return <p className='text-center text-red-500'>Error: {error}</p>

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products?.length > 0 ? (
                products.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='block'>
                        <div className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
                            <div className='w-full h-96 mb-4 overflow-hidden rounded-lg'>
                                <img
                                    className='w-full h-full object-cover rounded-lg'
                                    src={product.images?.[0]?.url || "/images/fallback-image.jpg"}
                                    alt={product.name || "Product Image"}
                                />
                            </div>
                            <h3 className='text-lg font-medium'>{product.name}</h3>
                            <p className='text-gray-700'>${product.price?.toFixed(2)}</p>
                        </div>
                    </Link>
                ))
            ) : (
                <p className='col-span-full text-center text-gray-500'>No products found.</p>
            )}
        </div>
    )
}

export default ProductGrid
