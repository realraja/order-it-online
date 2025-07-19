import SingleProductDetail from '@/components/user/products/SingleProductDetail'
import React from 'react'

export default function ProductDetailPage({ params }) {

// console.log(params.slug)



  return (
    <div className="min-h-screen m-2">
      <SingleProductDetail slug={params?.slug} />
    </div>
  )
}