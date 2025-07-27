'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCancelOrderMutation, useGetOrdersQuery } from '@/redux/api/user'
import { 
  FiPackage, 
  FiCalendar, 
  FiMapPin, 
  FiCreditCard, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiChevronDown, 
  FiChevronUp, 
  FiShoppingBag, 
  FiArrowRight 
} from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import AddReviewDialog from '@/components/user/review/AddReviewDialog'
import { useAsyncMutation } from '@/hook/mutationHook'
import DialogContext from '@/components/ui/DailogContext'
import { FcCancel } from 'react-icons/fc'

function OrderPage() {
  const { data, isLoading } = useGetOrdersQuery()
  const orders = data?.data || []
  const [expandedOrders, setExpandedOrders] = useState({})
  const [isAddReviewDialog, setIsAddReviewDialog] = useState({show:false, productSlug:'',orderId:''})
  const [isConfirmCancelDialog, setIsConfirmCancelDialog] = useState({show:false, id:''})

  const [cancelOrder] = useAsyncMutation(useCancelOrderMutation)

  const handleCancelOrder = async() => {
    setIsConfirmCancelDialog(prev => ({...prev, show: false}))
    await cancelOrder({id: isConfirmCancelDialog.id})
    setIsConfirmCancelDialog({show: false, id: ''})    
  }

  // Status configuration
  const statusConfig = {
    pending: { 
      bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      icon: <FiClock className="text-yellow-100" />,
      text: 'Processing',
      textColor: 'text-yellow-800'
    },
    processing: { 
      bg: 'bg-gradient-to-r from-blue-400 to-blue-500',
      icon: <FiPackage className="text-blue-100" />,
      text: 'Processing',
      textColor: 'text-blue-800'
    },
    shipped: { 
      bg: 'bg-gradient-to-r from-purple-400 to-purple-500',
      icon: <FiTruck className="text-purple-100" />,
      text: 'Shipped',
      textColor: 'text-purple-800'
    },
    delivered: { 
      bg: 'bg-gradient-to-r from-green-400 to-green-500',
      icon: <FiCheckCircle className="text-green-100" />,
      text: 'Delivered',
      textColor: 'text-green-800'
    },
    cancelled: { 
      bg: 'bg-gradient-to-r from-red-400 to-red-500',
      icon: <FiClock className="text-red-100" />,
      text: 'Cancelled',
      textColor: 'text-red-800'
    }
  }

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4"></div>
            <div className="w-full space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <FiShoppingBag className="text-xl" />
            </div>
            Order History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review your past purchases and order status
          </p>
        </div>
        {orders.length > 0 && (
          <Link
            href="/products"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        )}
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto border border-gray-100 dark:border-gray-700"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="text-indigo-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No orders yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div layout className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <motion.div 
                  className={`p-6 ${expandedOrders[order._id] ? 'border-b border-gray-100 dark:border-gray-700' : ''} transition-colors`}
                  // whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${statusConfig[order.orderStatus]?.bg || 'bg-gray-500'}`}></div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <FiCalendar className="text-sm" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          <span className="mx-1.5">•</span>
                          {order.item.quantity} item{order.item.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">

                      {order?.orderStatus === 'pending' && (
                        <button 
                          onClick={() => setIsConfirmCancelDialog({show: true, id: order._id})}
                          className="text-red-500 cursor-pointer hover:text-red-700 text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order?.orderStatus === 'delivered' && !order.review && (
                        <button 
                          onClick={() => setIsAddReviewDialog({show: true, productSlug: order.item.product?.slug,orderId:order._id})}
                          className="text-indigo-500 cursor-pointer hover:text-indigo-700 text-sm font-medium"
                        >
                          Review
                        </button>
                      )}

                      {order.review && <p className={`${order.review.status === 'pending'? 'text-yellow-300': order.review.status === 'approved'? 'text-green-1':'text-shadow-rose-600'}`}>Review Status : {order.review.status}</p>}


                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.orderStatus]?.textColor || 'text-gray-800 dark:text-gray-200'} bg-opacity-20 ${statusConfig[order.orderStatus]?.bg || 'bg-gray-500'}`}>
                        {statusConfig[order.orderStatus]?.text || order.orderStatus}
                      </div>
                      
                      <motion.div
                        animate={{ rotate: expandedOrders[order._id] ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 cursor-pointer p-3"
                        onClick={() => toggleOrder(order._id)}
                      >
                        {expandedOrders[order._id] ? (
                          <FiChevronUp className="text-current" />
                        ) : (
                          <FiChevronDown className="text-current" />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {expandedOrders[order._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-6">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Items in this order</h4>
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <Link 
                              href={`/product/${order.item.product.slug || order.item.product._id}`}
                              className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                              <Image
                                src={order.item.product.imageCover}
                                alt={order.item.product.name}
                                fill
                                className="object-cover"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/product/${order.item.product.slug || order.item.product._id}`}
                                className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                              >
                                {order.item.product.name}
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.item.product.brand}</p>
                              {order.item.product.variantName && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.item.product.variantName}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium">
                                  ₹{order.item.product.discountPrice || order.item.product.price}
                                </span>
                                {order.item.product.discountPrice && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                    ₹{order.item.product.price}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500 dark:text-gray-400">× {order.item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ₹{((order.item.product.discountPrice || order.item.product.price) * order.item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500">
                                <FiMapPin className="text-current" />
                              </div>
                              Shipping Details
                            </h5>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                              <p className="font-medium">{order.shippingAddress.name}</p>
                              <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.landmark}</p>
                              <p className="text-gray-600 dark:text-gray-300">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300">{order.shippingAddress.country}</p>
                              <p className="text-gray-600 dark:text-gray-300 mt-2">Phone: {order.shippingAddress.phone}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500">
                                <FiCreditCard className="text-current" />
                              </div>
                              Payment Information
                            </h5>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Method:</span>
                                <span className="font-medium capitalize">
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                </span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                <span className="font-medium capitalize">{order.paymentStatus}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Items:</span>
                                <span className="font-medium">
                                  {order.item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                                <span className="text-gray-600 dark:text-gray-300">Total:</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                  ₹{order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {isAddReviewDialog.show && (
        <AddReviewDialog 
          show={isAddReviewDialog.show} 
          onClose={() => setIsAddReviewDialog({show: false, productSlug: '',orderId:''})} 
          productSlug={isAddReviewDialog.productSlug}
          orderId={isAddReviewDialog.orderId}
        />
      )}

      {isConfirmCancelDialog.show && (
        <DialogContext 
          showDialog={isConfirmCancelDialog.show} 
          onClose={() => setIsConfirmCancelDialog({show: false, id: ''})} 
          title="Cancel Order" 
          Icon={FcCancel} 
          onSubmit={handleCancelOrder}
        >
          Are you sure you want to cancel this order?
        </DialogContext>
      )}
    </motion.div>
  )
}

export default OrderPage