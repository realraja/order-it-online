'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { addToCart, deleteFromCart, setIsLoginDialog } from '@/redux/slicer/auth'
import { useAddRemoveFromCartMutation, useDeleteFromCartMutation } from '@/redux/api/user'
import OrderSummery from '@/components/user/Checkout/OrderSummery'

function CartPage() {
    const { cart, isUser } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch();

    const [DeleteFromCart] = useDeleteFromCartMutation();
    const [AddRemoveFromCart] = useAddRemoveFromCartMutation();

    useEffect(() => {
        setLoading(false)
    }, []);

    // Sample addresses - in a real app these would come from user data


    // Calculate totals
    const subtotal = cart?.reduce((sum, item) => {
        const price = item.product?.discountPrice || item.product?.price
        return sum + (price * item.quantity)
    }, 0) || 0


    const handleRemoveItem = async (id) => {
        dispatch(deleteFromCart(id))
        if(isUser)  await DeleteFromCart({ product: id })
    }

    const handleUpdateQuantity = async(product, quantity) => {
        dispatch(addToCart({product,quantity}))
        if(isUser)  await AddRemoveFromCart({product:product._id,quantity})
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="flex gap-4">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                <FiShoppingCart className="text-green-500" />
                Your Shopping Cart
                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full ml-2">
                    {cart?.length || 0} items
                </span>
            </h1>

            {cart?.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FiShoppingCart className="text-gray-400 text-3xl" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
                    <Link href="/products" className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {cart?.map((item) => (
                                <motion.div
                                    key={item.product._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-white dark:bg-gray-800`}
                                >
                                    <Link
                                        href={`/product/${item.product?.slug}`}
                                        className="flex-shrink-0 w-full sm:w-24 h-24 rounded overflow-hidden"
                                    >
                                        <Image
                                            height={400}
                                            width={400}
                                            src={item.product?.imageCover}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        />
                                    </Link>

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <Link
                                                href={`/product/${item.product?.slug}`}
                                                className="font-medium text-gray-900 dark:text-white hover:text-green-500 transition-colors"
                                            >
                                                {item.product?.name}
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveItem(item.product?._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.product?.brand}</p>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-4">
                                                <div className="flex border rounded-lg overflow-hidden">
                                                    <button
                                                    disabled={item.quantity === 1}
                                                        onClick={() => handleUpdateQuantity(item.product, - 1)}
                                                        className={`px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600  text-black dark:text-white transition-colors  ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <FiMinus size={14} />
                                                    </button>
                                                    <span className="px-3 py-1 w-12  text-black dark:text-white text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product, + 1)}
                                                        disabled={item.quantity >= item.product?.quantity}
                                                        className={`px-3  text-black dark:text-white py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${item.quantity >= item.product?.quantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <FiPlus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.product?.quantity} available
                                                </span>
                                            </div>

                                            <div className="text-right">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    ₹{(item.product?.discountPrice || item.product?.price)?.toLocaleString()}
                                                </span>
                                                {item.product?.discountPrice && (
                                                    <span className="block text-xs text-gray-500 dark:text-gray-400 line-through">
                                                        ₹{item.product?.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    {!isUser ? (
                        <div className="space-y-6">
                            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Login to Checkout</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to proceed with your order and save your cart.</p>
                                <button 
                                    onClick={() => dispatch(setIsLoginDialog(true))}
                                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                                >
                                    <FiUser className="text-lg" />
                                    Login Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <OrderSummery subtotal={subtotal}  />
                    )}
                </div>
            )}
        </motion.div>
    )
}

export default CartPage