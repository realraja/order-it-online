'use client'
import ProductCard from '@/components/user/ProductCard'
import { useGetUserAllProductByPageAndLimitQuery } from '@/redux/api/user'
import React, { useEffect, useState } from 'react'
import { FiLoader, FiArrowDown } from 'react-icons/fi'

export default function ProductListingPage() {
  const productPerPageLimit = 8
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Always fetch based on page state
  const { data, isFetching } = useGetUserAllProductByPageAndLimitQuery({
    page,
    limit: productPerPageLimit,
  })

  // When data changes, update products list
  useEffect(() => {
    if (data) {
      const newProducts = data.data.products
      setTotalPages(data.data.pagination.totalPages)

      if (page === 1) {
        setProducts(newProducts)
      } else {
        setProducts(prev => [...prev, ...newProducts])
      }

      setInitialLoading(false)
      setIsLoadingMore(false)
    }
  }, [data])

  const loadMore = () => {
    if (page < totalPages && !isFetching) {
      setIsLoadingMore(true)
      setPage(prev => prev + 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Our Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover our amazing collection
        </p>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <>
            <ProductCard products={products} isLoading={initialLoading}  />

            {/* Load More Button */}
            {page < totalPages &&  (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore || isFetching}
                  className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                  {isLoadingMore ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <FiArrowDown className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* End of results */}
            {page >= totalPages && products.length > 0 && (
              <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                You've reached the end of products
              </div>
            )}
          </>
      </div>
    </div>
  )
}
