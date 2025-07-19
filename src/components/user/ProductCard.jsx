'use client'
import React, { useState } from 'react'
import { FiShoppingCart, FiFilter, FiChevronDown, FiEye } from "react-icons/fi"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { addToCart } from '@/redux/slicer/auth'
import { useAddRemoveFromCartMutation } from '@/redux/api/user'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

function ProductCard({ products, isLoading }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [sortOption, setSortOption] = useState('recent')
  const [showSortOptions, setShowSortOptions] = useState(false)
  const router = useRouter();

  const { cart } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [AddRemoveFromCart] = useAddRemoveFromCartMutation();

  const handleOnView = async (slug) => {
    router.push(`/product/${slug}`)
  }

  const handleAddToCart = async (product) => {
    if (cart?.find(p => p.product?._id === product?._id)?.quantity) return router.push('/cart')
    try {
      dispatch(addToCart({ product: product, quantity: 1 }))
      toast.success('Added to cart!', { autoClose: 1000, hideProgressBar: true })
      await AddRemoveFromCart({ product: product?._id, quantity: 1 })
    } catch (error) {
      console.log(error);
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Sorting functions
  const sortProducts = () => {
    const sortedProducts = [...products]

    switch (sortOption) {
      case 'rating-high':
        return sortedProducts.sort((a, b) => b.rating - a.rating)
      case 'rating-low':
        return sortedProducts.sort((a, b) => a.rating - b.rating)
      case 'price-high':
        return sortedProducts.sort((a, b) => b.discountPrice - a.discountPrice)
      case 'price-low':
        return sortedProducts.sort((a, b) => a.discountPrice - b.discountPrice)
      case 'recent':
      default:
        return sortedProducts // Assuming products are already in recent order
    }
  }

  const sortedProducts = sortProducts()

  const buttonHover = {
    scale: 1.05,
    backgroundColor: "#4f46e5",
    transition: {
      duration: 0.2,
    },
  }

  const buttonTap = {
    scale: 0.95,
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const hoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  }

  return (
    isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    ) : (
      <>
        {/* Sorting Controls */}
        <div className="flex justify-end mb-6 relative">
          <motion.button
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <FiFilter className="text-indigo-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {sortOption === 'recent' && 'Most Recent'}
              {sortOption === 'rating-high' && 'Rating: High to Low'}
              {sortOption === 'rating-low' && 'Rating: Low to High'}
              {sortOption === 'price-high' && 'Price: High to Low'}
              {sortOption === 'price-low' && 'Price: Low to High'}
            </span>
            <FiChevronDown className={`transition-transform ${showSortOptions ? 'rotate-180' : ''}`} />
          </motion.button>

          {showSortOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-0 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden z-50"
            >
              {[
                { value: 'recent', label: 'Most Recent' },
                { value: 'rating-high', label: 'Rating: High to Low' },
                { value: 'rating-low', label: 'Rating: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'price-low', label: 'Price: Low to High' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className={`w-full text-left px-4 py-2 text-sm ${sortOption === option.value ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-600 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`}
                  onClick={() => {
                    setSortOption(option.value)
                    setShowSortOptions(false)
                  }}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product?._id}
              variants={item}
              className="relative"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Discount badge */}
              {product?.price > product?.discountPrice && (
                <motion.div
                  className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {Math.round(((product?.price - product?.discountPrice) / product?.price) * 100)}% OFF
                </motion.div>
              )}

              <motion.div
                className="bg-white cursor-pointer dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700"
                whileHover={hoverEffect}
              >
                {/* Image with hover effect */}
                <div onClick={() => handleOnView(product?.slug)} className="relative cursor-pointer overflow-hidden h-56">
                  <motion.img
                    src={product?.imageCover}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-black/10 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-full flex items-center shadow-lg"
                      >
                        <FiShoppingCart className="mr-2" />
                        View
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                {/* Product details */}
                <div className="p-5 flex-grow flex flex-col">
                  <div onClick={() => handleOnView(product?.slug)} className="cursor-pointer mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {product?.brand}
                    </span>
                  </div>

                  <h3 onClick={() => handleOnView(product?.slug)} className="text-lg cursor-pointer font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product?.name.split('|')[0].trim()}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product?.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product?.rating?.toFixed(1)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product?.discountPrice)}
                      </span>
                      {product?.price > product?.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product?.price)}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-4 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      {!cart?.find(p => p.product?._id === product?._id)?.quantity?<><FiShoppingCart className="mr-2" />Add to Cart</>:<><FiEye className="mr-2" />View Cart</>}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </>
    )
  )
}

export default ProductCard



const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
    </div>
  </div>
)