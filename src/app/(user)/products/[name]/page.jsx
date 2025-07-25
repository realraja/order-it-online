import ProductBySearch from '@/components/user/products/ProductsBySearch'
import React from 'react'

export default async function ProductDetailPage({ params }) {

// console.log(params.name)
const name = await params.name;



  return (
    <div className="min-h-screen m-2">
      <ProductBySearch name={name} />
    </div>
  )
}