'use client'
import DialogContext from '@/components/ui/DailogContext'
import { useAsyncMutation } from '@/hook/mutationHook'
import { Star, Upload, X } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useAddReviewMutation } from '@/redux/api/user'

function AddReviewDialog({ show, productSlug,orderId, onClose }) {
  const [AddReview] = useAsyncMutation(useAddReviewMutation)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [images, setImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  console.log(productSlug)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (review.trim().length < 10) {
      toast.error('Please write a review with at least 10 characters')
      return
    }
    
    try {
      onClose()
      await AddReview({ review, images:images.map(i=> i.url), slug: productSlug,orderId, rating })
    //   Reset form
      setRating(0)
      setReview('')
      setImages([])
      toast.success('Review submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit review. Please try again.')
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      toast.error('You can upload maximum 5 images')
      return
    }

    setIsUploading(true)
    const uploadPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            id: Math.random().toString(36).substring(7),
            url: e.target.result,
            file
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(uploadPromises)
      .then(newImages => {
        setImages(prev => [...prev, ...newImages])
        toast.success(`${files.length} image(s) uploaded`)
      })
      .catch(() => {
        toast.error('Failed to upload images')
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
    toast('Image removed', { icon: '🗑️' })
  }

  return (
    <DialogContext 
      showDialog={show} 
      onClose={onClose} 
      title={'Add Your Review'} 
      Icon={Star} 
      onSubmit={handleSubmit}
      submitText="Submit Review"
      submitDisabled={rating === 0 || review.trim().length < 10}
    >
      <div className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Your Rating</h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-500'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              {rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''}` : 'Not rated'}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label htmlFor="review" className="block font-medium text-gray-700 dark:text-gray-300">
            Your Review
          </label>
          <textarea
            id="review"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Share your experience with this product..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Minimum 10 characters ({review.length}/10)
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Add Photos (Optional)
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <Image
                    src={image.url}
                    alt="Review image"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                {isUploading ? (
                  <div className="animate-pulse text-gray-400">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload up to 5 photos ({images.length}/5)
          </p>
        </div>

        {/* Review Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            Writing a good review
          </h4>
          <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc pl-5">
            <li>Describe your experience with the product</li>
            <li>Mention quality, performance, and value</li>
            <li>Include both pros and cons</li>
            <li>Be honest and specific</li>
          </ul>
        </div>
      </div>
    </DialogContext>
  )
}

export default AddReviewDialog