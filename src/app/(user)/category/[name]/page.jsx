import ProductByCategory from '@/components/user/products/ProductByCategory'
import React from 'react'

export default async function ProductDetailPage({ params }) {

// console.log(params.name)
const name = await params.name



  return (
    <div className="min-h-screen m-2">
      <ProductByCategory slug={name} />
    </div>
  )
}