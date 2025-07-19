import ProductBySearch from '@/components/user/products/ProductsBySearch'
import React from 'react'

export default function ProductDetailPage({ params }) {

console.log(params.name)



  return (
    <div className="min-h-screen m-2">
      <ProductBySearch name={params.name} />
    </div>
  )
}