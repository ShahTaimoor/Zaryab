import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrival from '../components/Products/NewArrival'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedColection from '../components/Products/FeaturedColection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilter } from '../redux/slices/productSlice'
import axios from 'axios'




const Home = () => {

    const dispatch = useDispatch()

    const { products, loading, error } = useSelector((state) => state.products)
    const [bestSellerProduct, setBestSelerProduct] = useState(null)

    useEffect(() => {
        // fetch products for a specific collections

        dispatch(fetchProductsByFilter({
            gender: 'Women',
            category: "Bottom Wear",
            limit: 8,
        }));

        // fetch best seller products

        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
                setBestSelerProduct(response.data);
            } catch (error) {
                console.error("Error fetching best seller products:", error);
            }

        }

        fetchBestSeller()

    }, [dispatch])
    return (
        <>
            <Hero />
            <GenderCollectionSection />
            <NewArrival />

            {/* Best Seller */}
            <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
            {
                bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />)
                    : <p className='text-center'>Loading best seller products...</p>}


            <div className='container mx-auto'>
                <h2 className='text-3xl text-center font-bold mb-4'>Top Wears For Women</h2>
                <ProductGrid products={products} loading={loading} error={error} />
            </div>

            <FeaturedColection />
            <FeaturesSection />
        </>
    )
}

export default Home