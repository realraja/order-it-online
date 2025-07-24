'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiShoppingCart, FiHeart, FiMapPin, FiEdit2, FiArrowRight, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import WishlistPage from '../wishlist/page';
import { LogOut, Trash2 } from 'lucide-react';
import AddUpdateDeleteAddressDialog from '@/components/user/Address/AddUpdateDeleteAddressDialog';
import OrderPage from '../orders/page';
import ThemeToggle from '@/components/ui/ThemeContext';
import LogoutDialog from '@/components/user/dialog/LogoutDialog';

function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const { userData, addresses } = useSelector(state => state.auth);
    const [addressActionDialog, setAddressActionDialog] = useState({ data: {}, show: false, type: 'add' });
    const [isLogOutDialog, setIsLogOutDialog] = useState(false);

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
                className="bg-gradient-to-r relative from-green-500 to-blue-500 rounded-2xl p-6 shadow-lg mb-8"
            >
                <div className='absolute top-2 right-3'>
                            <ThemeToggle /></div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <motion.div variants={itemVariants} className="relative">
                        <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <img
                                src={userData?.imgUrl || '/default-avatar.jpg'}
                                alt={userData?.name}
                                height={400}
                                width={400}
                                className="object-cover h-full w-full"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex gap-2">
                            <button onClick={()=> setIsLogOutDialog(true)} className="p-2 cursor-pointer bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                <LogOut className="text-rose-500 w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex-1 text-white">
                        <h1 className="text-3xl font-bold">{userData?.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <FiMail className="text-white/80" />
                            <p className="text-white/90">{userData?.email}</p>
                        </div>
                        <div className="flex gap-4 mt-4 flex-wrap">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                                <p className="text-sm text-white/80">Wishlist</p>
                                <p className="text-xl font-bold text-white">{userData?.wishlist?.length || 0}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                                <p className="text-sm text-white/80">Cart Items</p>
                                <p className="text-xl font-bold text-white">{userData?.cart?.length || 0}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                                <p className="text-sm text-white/80">Addresses</p>
                                <p className="text-xl font-bold text-white">{userData?.addresses?.length || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'wishlist' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                >
                    Wishlist
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'orders' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                >
                    Orders
                </button>
                <button
                    onClick={() => setActiveTab('addresses')}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'addresses' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
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
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm p-6"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <FiUser className="text-green-500" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{userData?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            {new Date(userData?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm p-6"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <FiShoppingCart className="text-green-500" />
                                    Recent Cart Items
                                </h3>
                                <div className="space-y-4">
                                    {userData?.cart?.slice(0, 3).map(item => (
                                        <div key={item._id} className="flex gap-3 items-center">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                                <Image
                                                    src={item.product.imageCover}
                                                    alt={item.product.name}
                                                    height={400}
                                                    width={400}
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{item.product.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ₹{item.product.discountPrice} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {userData?.cart?.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                                    )}
                                    <Link href="/cart" className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
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
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                                    <FiMapPin className="text-green-500" />
                                    Your Addresses
                                </h3>
                                <button 
                                    onClick={() => setAddressActionDialog({ show: true, type: 'add', data: {} })}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <FiPlus /> Add New Address
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses?.map(address => (
                                    <motion.div
                                        key={address._id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`border rounded-lg p-4 relative bg-white dark:bg-gray-700 ${address.isDefault ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                                    >
                                        {address.isDefault && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        <h4 className="font-bold text-gray-800 dark:text-white">{address.name}</h4>
                                        <p className="text-gray-600 dark:text-gray-300">{address.landmark}, {address.city}</p>
                                        <p className="text-gray-600 dark:text-gray-300">{address.state}, {address.country} - {address.zipCode}</p>
                                        <p className="text-gray-600 dark:text-gray-300">Phone: {address.phone}</p>
                                        <div className='flex justify-between items-center mt-3'>
                                            <button 
                                                onClick={() => setAddressActionDialog({ show: true, type: 'update', data: address })}
                                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center gap-1"
                                            >
                                                <FiEdit2 size={14} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => setAddressActionDialog({ show: true, type: 'delete', data: address })}
                                                className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 flex items-center gap-1"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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

            {
                isLogOutDialog && <LogoutDialog isShow={isLogOutDialog} setIsShow={setIsLogOutDialog} />
            }
        </motion.div>
    );
}

export default ProfilePage;