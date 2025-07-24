'use client'
import React, { useEffect, useState } from 'react'
import { FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight, FiHeart, FiExternalLink } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAddRemoveFromCartMutation, useGetUserProductBySlugQuery, useToggleWishlistMutation } from '@/redux/api/user'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, setIsLoginDialog, toggleWishlistItem } from '@/redux/slicer/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

function SingleProductDetail({ slug }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const { isUser, wishlist, cart } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { data, isLoading } = useGetUserProductBySlugQuery(slug)
  const [ToggleWishlist] = useToggleWishlistMutation();
  const [AddRemoveFromCart] = useAddRemoveFromCartMutation();

  const router = useRouter();

  const product = data?.data;

  useEffect(() => {
    setIsWishlisted(wishlist?.includes(product?._id) ?? false);
    if (product?.isVariants && product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, data, wishlist]);

  const displayProduct = selectedVariant || product;

  const nextImage = () => {
    setCurrentImageIndex(prev =>
      prev === displayProduct?.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? displayProduct?.images.length - 1 : prev - 1
    )
  }

  const handleQuantityChange = (value) => {
    const newValue = quantity + value
    if (newValue > 0 && newValue <= (displayProduct?.quantity || 10)) {
      setQuantity(newValue)
    }
  }

  const toggleWishlist = async () => {
    if (!isUser) {
      toast('Please Login First!')
      dispatch(setIsLoginDialog(true))
    } else {
      try {
        setIsWishlisted(!isWishlisted)
        await ToggleWishlist({ product: product._id })
        dispatch(toggleWishlistItem(product._id))
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleAddToCart = async () => {
    const productToAdd = selectedVariant || product;
    if (cart?.find(p => p.product?._id === productToAdd?._id)?.quantity) return router.push('/cart')
    try {
      dispatch(addToCart({ product: productToAdd, quantity }))
      toast.success('Added to cart!', { autoClose: 1000, hideProgressBar: true })
      await AddRemoveFromCart({ product: productToAdd?._id, quantity })
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery Loading */}
          <div className="space-y-6">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-xl aspect-square h-[500px] w-full"></div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-24 w-24"></div>
              ))}
            </div>
          </div>

          {/* Product Info Loading */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/6"></div>
            </div>

            <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Product not found</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">The product you're looking for doesn't exist or may have been removed.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 lg:sticky bottom-0 self-start">
          <div className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square shadow-lg">
            <Image
              height={600}
              width={600}
              src={displayProduct?.images[currentImageIndex] || displayProduct?.imageCover}
              alt={displayProduct?.name}
              className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
              priority
            />

            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-900 p-3 rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-900 p-3 rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Discount badge */}
            {displayProduct?.discountPrice && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                {Math.round(((displayProduct.price - displayProduct.discountPrice) / displayProduct.price) * 100)}% OFF
              </motion.div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-4 scrollbar-hide">
            {displayProduct?.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all duration-200 ease-in-out ${currentImageIndex === index ? 'border-green-500 ring-2 ring-green-300' : 'border-transparent hover:border-gray-300'}`}
              >
                <Image
                  height={96}
                  width={96}
                  src={img}
                  alt={`${displayProduct?.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{displayProduct?.brand}</span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{displayProduct?.name}</h1>

            {product?.isVariants && product?.variants?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Variants:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-md ${selectedVariant?._id === variant._id ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                    >
                      {variant.variantName || variant._id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center mt-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < 4 ? "currentColor" : "none"} className="w-5 h-5" />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(24 reviews)</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {displayProduct?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {displayProduct?.discountPrice ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-green-600">
                    ₹{displayProduct.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    ₹{displayProduct.price.toLocaleString()}
                  </span>
                </div>
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  You save ₹{(displayProduct.price - displayProduct.discountPrice).toLocaleString()}!
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₹{displayProduct?.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quantity */}
          {!cart?.find(p => p.product?._id === displayProduct?._id)?.quantity && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="px-6 text-black dark:text-white py-3 w-16 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 text-black dark:text-white py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {displayProduct?.quantity} available
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              {cart?.find(p => p?.product?._id === displayProduct?._id)?.quantity ? (
                <><FiExternalLink size={20} /> Go To Cart</>
              ) : (
                <><FiShoppingCart size={20} /> Add To Cart</>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWishlist}
              className={`p-4 rounded-xl transition-colors shadow-lg ${isWishlisted ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <FiHeart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
          </div>



          {/* Product Meta */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">Category:</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.category?.name || product.category}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">Status:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {displayProduct?.status === 'active' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">SKU:</span>
                <span className="text-gray-900 dark:text-white font-medium">{displayProduct?._id}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 w-24">Shipping:</span>
                <span className="text-gray-900 dark:text-white font-medium">Free worldwide</span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
                {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h3>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {displayProduct?.description}
            </div>
          </div>
    </motion.div>
  )
}

export default SingleProductDetail