'use client';
import { useGetUserProductQuery } from "@/redux/api/user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {  FiStar, FiClock, FiTruck, FiArrowRight } from "react-icons/fi";
import ProductCard from "../ProductCard";
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { data, isLoading } = useGetUserProductQuery();

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setProducts(data?.data);
    }
  }, [data]);







  const loadMoreProducts = () => {
    // setVisibleProducts(prev => prev + 4);
    router.push('/products')
  };

  // Loading skeleton


  return (
    <div>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our premium selection of high-quality products at unbeatable prices
            </p>
          </motion.div>

          {/* Features ribbon */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
              <FiClock className="text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Fast Delivery</span>
            </div>
            <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
              <FiTruck className="text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Free Shipping</span>
            </div>
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full">
              <FiStar className="text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Premium Quality</span>
            </div>
          </motion.div>


          <ProductCard products={products.slice(0, visibleProducts)} isLoading={isLoading} />

          {visibleProducts < products.length && (
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={loadMoreProducts}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Show More Products
                    <FiArrowRight className="ml-3 -mr-1 w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

        </div>
      </section>

      {/* Promotional Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden"
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-12 max-w-xl">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Summer Sale - Limited Time Offer!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg opacity-90 mb-6"
              >
                Get <span className="font-bold">30% off</span> on all items this week. Use code:
                <span className="bg-white/20 px-3 py-1 rounded-full ml-2 font-mono font-bold">SUMMER30</span>
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-indigo-600 dark:text-indigo-800 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Shop the Sale <FiArrowRight className="inline ml-2" />
              </motion.button>
            </div>
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              viewport={{ once: true }}
              className="relative w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-full flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping-slow"></div>
              <div className="text-4xl md:text-5xl font-bold text-center">
                <div className="text-6xl md:text-7xl font-black mb-2">30%</div>
                <div className="text-xl">OFF</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default FeaturedProducts;