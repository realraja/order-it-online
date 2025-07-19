import ProductByCategory from '@/components/user/products/ProductByCategory'
import React from 'react'

export default function ProductDetailPage({ params }) {

console.log(params.name)



  return (
    <div className="min-h-screen m-2">
      <ProductByCategory slug={params.name} />
    </div>
  )
}