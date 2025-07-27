'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiX, FiCreditCard, FiUser, FiMapPin } from 'react-icons/fi';
import DialogContextSimple from '@/components/ui/SimpleDialogContext';

function ViewOrderDetailsDialog({ data, isOpen, onClose }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiPackage className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
  };

  return (
    <DialogContextSimple
    isFullWidth={true}
      showDialog={isOpen}
      onClose={() => onClose(false)}
      className="max-w-2xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <FiPackage className="text-indigo-600" />
            Order #{data._id.slice(-8).toUpperCase()}
          </motion.h2>
          <button
            onClick={() => onClose(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Order Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center justify-between p-4 rounded-lg ${getStatusColor(data.orderStatus)}`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(data.orderStatus)}
            <div>
              <p className="font-medium">Order Status</p>
              <p className="text-sm capitalize">{data.orderStatus}</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 px-3 py-1 rounded-full ${getPaymentStatusColor(data.paymentStatus)}`}>
            <FiCreditCard className="text-current" />
            <span className="text-sm capitalize">{data.paymentStatus}</span>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FiMapPin className="text-indigo-600" />
              Shipping Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{data.shippingAddress.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{data.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium">
                  {data.shippingAddress.landmark}, {data.shippingAddress.city}, {data.shippingAddress.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                <p className="font-medium">
                  {data.shippingAddress.country} - {data.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FiUser className="text-indigo-600" />
              Customer Information
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <motion.div whileHover={{ scale: 1.05 }} className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/50">
                <img 
                  src={data.user.imgUrl} 
                  alt={data.user.name} 
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div>
                <p className="font-medium">{data.user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{data.user.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
              <p className="font-medium">
                {new Date(data.user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-4">Order Item</h3>
          <div className="space-y-4">
            <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={data.item.product.imageCover} 
                      alt={data.item.product.name} 
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{data.item.product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.item.product.brand}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {data.item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(data.item.product.discountPrice || data.item.product.price).toFixed(2)}</p>
                    {data.item.product.discountPrice && (
                      <p className="text-xs line-through text-gray-500 dark:text-gray-400">
                        ₹{data.item.product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="font-medium">₹{data.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Payment Method</span>
                <span className="font-medium capitalize">{data.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  ₹{data.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </DialogContextSimple>
  );
}

export default ViewOrderDetailsDialog;