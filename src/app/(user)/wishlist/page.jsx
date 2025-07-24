'use client';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useGetWishlistQuery } from '@/redux/api/user';
import ProductCard from '@/components/user/ProductCard';
import Link from 'next/link';

function WishlistPage() {
  const { data, isLoading } = useGetWishlistQuery();
  const products = data?.data || [];

  // console.log(data)

  // Loading skeleton
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiHeart className="text-pink-500" />
            <span>Your Wishlist</span>
            <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded-full">
              Loading...
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FiHeart className="text-pink-500" />
          <span>Your Wishlist</span>
          {products.length > 0 && (
            <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded-full">
              {products.length} items
            </span>
          )}
        </h1>

        {products.length > 0 && (
          <Link
            href="/products"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
          >
            Continue shopping <FiArrowRight />
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto w-40 h-40 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-6">
            <FiHeart className="text-pink-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Save your favorite items here to keep track of what you love!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-pink-200 dark:hover:shadow-pink-900/50"
          >
            Start Exploring
          </Link>
        </motion.div>
      ) : (
        <ProductCard products={products} isLoading={isLoading} />
      )}
    </motion.div>
  );
}

export default WishlistPage;