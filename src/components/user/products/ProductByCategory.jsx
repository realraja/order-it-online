'use client'
import { useGetUserProductByCategoryQuery } from '@/redux/api/user'
import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard'
import { motion } from 'framer-motion'

function ProductByCategory({ slug }) {
  const [products, setProducts] = useState([])
  const { data, isLoading, isError } = useGetUserProductByCategoryQuery(slug)

  useEffect(() => {
    if (data?.data?.products) {
      setProducts(data?.data?.products || [])
    }
  }, [data])

  // console.log(products)



//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <FiLoader className="animate-spin text-4xl text-indigo-600" />
//       </div>
//     )
//   }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load products. Please try again.</p>
      </div>
    )
  }

  if (!products?.length && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {data?.data?.category?.name || 'Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </motion.div>

     
        <ProductCard products={products} isLoading={isLoading} />
    </div>
  )
}

export default ProductByCategory