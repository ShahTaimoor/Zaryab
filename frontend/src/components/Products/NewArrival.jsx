import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrival = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Fetch New Arrivals
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        };
        fetchNewArrivals();
    }, []);

    // Smooth scrolling function
    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollAmount = direction === "left" ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    // Update Scroll Buttons Visibility
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (!container) return;
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons(); // Initial check
        }
        return () => container?.removeEventListener("scroll", updateScrollButtons);
    }, [newArrivals]); 

    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
                <p className="text-lg text-gray-600">
                    Discover the latest styles straight off the runway, freshly added to keep your wardrobe up to date.
                </p>
                {/* Scroll Buttons */}
                <div className="absolute right-0 bottom-[-40px] md:bottom-[-30px] flex space-x-2">
                    <button
                        disabled={!canScrollLeft}
                        onClick={() => scroll("left")}
                        className={`p-2 rounded border transition-all duration-300 ${canScrollLeft ? "bg-white text-black hover:bg-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <MdOutlineKeyboardArrowLeft className="text-2xl" />
                    </button>
                    <button
                        disabled={!canScrollRight}
                        onClick={() => scroll("right")}
                        className={`p-2 rounded border transition-all duration-300 ${canScrollRight ? "bg-white text-black hover:bg-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <MdOutlineKeyboardArrowRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="container mx-auto flex space-x-6 relative overflow-x-auto scrollbar-hide"
                style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    touchAction: "manipulation", // Improves scrolling on mobile
                    WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                }}
            >
                {newArrivals.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[80%] sm:min-w-[50%] lg:min-w-[30%] relative"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        <img
                            className="w-full h-[500px] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                            src={product.images[0]?.url}
                            alt={product.images[0]?.altText || product.name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="mt-1">${product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrival;
