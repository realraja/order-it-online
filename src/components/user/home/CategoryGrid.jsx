"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetUserCategoryQuery } from '@/redux/api/user';
import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CategoriesGrid({ showAll = false, initialData }) {
  const [showAllCategories, setShowAllCategories] = useState(showAll);
  const router = useRouter();

  // const { data, isLoading, isError } = useGetUserCategoryQuery();
  const { data = initialData, isLoading, isError } = useGetUserCategoryQuery(undefined, {
    skip: !!initialData,
  });

  // Get categories to display
  const categoriesToShow = showAllCategories
    ? data?.data || []
    : data?.data?.slice(0, 5) || [];

  const handleCategoryClicked = (slug) => {
    router.push(`/category/${slug}`);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          Shop by Category
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Failed to load categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {/* Display categories with simple hover animation */}
            {categoriesToShow.map((category) => (
              <motion.div
                onClick={() => handleCategoryClicked(category.slug)}
                key={category._id}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {category.products} {category.products === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Show All button - only visible when not showing all */}
            {!showAllCategories && data?.data?.length > 5 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center"
                onClick={() => setShowAllCategories(true)}
              >
                <div className="p-4 text-center">
                  <div className="text-white text-3xl mb-2">+{data.data.length - 5}</div>
                  <h3 className="text-lg font-bold text-white">Show All</h3>
                  <p className="text-sm text-white/80 mt-1 flex items-center justify-center">
                    View all <FiChevronRight className="ml-1" />
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}