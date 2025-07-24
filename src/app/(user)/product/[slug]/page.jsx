import SingleProductDetail from '@/components/user/products/SingleProductDetail'
import React from 'react'

export default async function ProductDetailPage({ params }) {

// console.log(params.slug)

const slug = await params?.slug



  return (
    <div className="min-h-screen m-2">
      <SingleProductDetail slug={slug} />
    </div>
  )
}