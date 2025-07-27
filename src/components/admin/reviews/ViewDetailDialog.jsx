import DialogContextSimple from '@/components/ui/SimpleDialogContext'
import Image from 'next/image'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'

function ViewDetailDialog({ show, onClose, data }) {
//   console.log(data)

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: star * 0.1 }}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300 fill-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {show && (
        <DialogContextSimple
          showDialog={show}
          onClose={onClose}
          isFullWidth={true}
          title="Review Details"
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg"
          >
            {/* Product Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0 relative">
                <Image
                  height={150}
                  width={150}
                  className="h-20 w-20 rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-300"
                  src={data?.product?.imageCover || data?.images?.[0] || '/placeholder.png'}
                  alt={data?.product?.name || 'Product Image'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {data?.product?.name || 'Product Name'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Brand: {data?.product?.brand || 'N/A'}
                </p>
                <div className="mt-2">{renderStars(data?.rating || 0)}</div>
              </div>
            </motion.div>

            {/* User Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="flex items-center space-x-3">
                <Image
                  height={50}
                  width={50}
                  className="h-12 w-12 rounded-full object-cover shadow-sm"
                  src={data?.user?.imgUrl || '/default-user.png'}
                  alt={data?.user?.name || 'User'}
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {data?.user?.name || 'Anonymous'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data?.user?.email || 'No email provided'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Review Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Review
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {data?.review || 'No review provided'}
              </p>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Date
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data?.createdAt 
                      ? new Date(data.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Status
                  </h4>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                      data?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {data?.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Images Section */}
            {data?.images?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Review Images
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {data.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <Image
                        height={100}
                        width={100}
                        className="h-24 w-full rounded-lg object-cover shadow-sm"
                        src={image}
                        alt={`Review image ${index + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </DialogContextSimple>
      )}
    </AnimatePresence>
  )
}

export default ViewDetailDialog