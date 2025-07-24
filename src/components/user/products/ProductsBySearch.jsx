'use client'
import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard'
import { motion } from 'framer-motion'
import { useGetUserAllProductBySearchQuery } from '@/redux/api/user'

function ProductBySearch({ name }) {
  const [products, setProducts] = useState([])
  const { data, isLoading, isError } = useGetUserAllProductBySearchQuery(name)

  useEffect(() => {
    if (data?.data) {
      setProducts(data?.data || [])
    }
  }, [data])

  // console.log(data?.data,name)




  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load products. Please try again.</p>
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this search.</p>
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

export default ProductBySearch