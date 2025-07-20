'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiShoppingCart, FiHeart, FiMapPin, FiEdit2, FiArrowRight, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import WishlistPage from '../wishlist/page';
import { Trash2 } from 'lucide-react';
import AddUpdateDeleteAddressDialog from '@/components/user/Address/AddUpdateDeleteAddressDialog';
import OrderPage from '../orders/page';

function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const { userData, addresses } = useSelector(state => state.auth);
    const [addressActionDialog, setAddressActionDialog] = useState({ data: {}, show: false, type: 'add' });

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-4 py-8"
        >
            {/* Profile Header */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 shadow-lg mb-8"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <motion.div variants={itemVariants}>
                        <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <img
                                src={userData?.imgUrl || '/default-avatar.jpg'}
                                alt={userData?.name}
                                height={400}
                                width={400}
                                className="object-cover h-full w-full"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex-1 text-white">
                        <h1 className="text-3xl font-bold">{userData?.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <FiMail className="text-white" />
                            <p>{userData?.email}</p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                                <p className="text-sm">Wishlist</p>
                                <p className="text-xl font-bold">{userData?.wishlist?.length || 0}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                                <p className="text-sm">Cart Items</p>
                                <p className="text-xl font-bold">{userData?.cart?.length || 0}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                                <p className="text-sm">Addresses</p>
                                <p className="text-xl font-bold">{userData?.addresses?.length || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`px-4 py-2 font-medium ${activeTab === 'wishlist' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
                >
                    Wishlist
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
                >
                    Orders
                </button>
                <button
                    onClick={() => setActiveTab('addresses')}
                    className={`px-4 py-2 font-medium ${activeTab === 'addresses' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
                >
                    Addresses
                </button>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiUser className="text-green-500" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{userData?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium">
                                            {new Date(userData?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiShoppingCart className="text-green-500" />
                                    Recent Cart Items
                                </h3>
                                <div className="space-y-4">
                                    {userData?.cart?.slice(0, 3).map(item => (
                                        <div key={item._id} className="flex gap-3 items-center">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image
                                                    src={item.product.imageCover}
                                                    alt={item.product.name}
                                                    height={400}
                                                    width={400}
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    ₹{item.product.discountPrice} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {userData?.cart?.length === 0 && (
                                        <p className="text-gray-500">Your cart is empty</p>
                                    )}
                                    <Link href="/cart" className="text-green-500 hover:underline flex items-center gap-1">
                                        View all cart items <FiArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <WishlistPage />
                    )}

                    {activeTab === 'orders' && (
                        <OrderPage />
                    )}

                    {activeTab === 'addresses' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FiMapPin className="text-green-500" />
                                Your Addresses
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses?.map(address => (
                                    <motion.div
                                        key={address._id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                                    >
                                        {address.isDefault && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        <h4 className="font-bold">{address.name}</h4>
                                        <p className="text-gray-600 dark:text-gray-300">{address.landmark}, {address.city}</p>
                                        <p className="text-gray-600 dark:text-gray-300">{address.state}, {address.country} - {address.zipCode}</p>
                                        <p className="text-gray-600 dark:text-gray-300">Phone: {address.phone}</p>
                                        <div className='flex justify-between items-center'>
                                            <button onClick={() => setAddressActionDialog({ show: true, type: 'update', data: address })} className="mt-3 cursor-pointer text-green-500 hover:text-green-700 flex items-center gap-1">
                                                <FiEdit2 size={14} /> Edit
                                            </button>
                                            <button onClick={() => setAddressActionDialog({ show: true, type: 'delete', data: address })} className="mt-3 text-rose-500 hover:text-rose-700 cursor-pointer flex items-center gap-1">
                                                <Trash2 size={14} /> Edit
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <button onClick={() => setAddressActionDialog({ show: true, type: 'add', data: {} })} className="mt-6 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                <FiPlus /> Add New Address
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AddUpdateDeleteAddressDialog
                type={addressActionDialog.type}
                data={addressActionDialog.data}
                isOpen={addressActionDialog.show}
                onClose={() => setAddressActionDialog({ data: {}, show: false, type: 'add' })}
            />
        </motion.div>
    );
}

export default ProfilePage;