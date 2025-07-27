"use client"
import {  useState } from 'react';
import { Search, ChevronDown, Star, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useGetReviewQuery, useUpdateReviewMutation } from '@/redux/api/admin';
import { useAsyncMutation } from '@/hook/mutationHook';
import Image from 'next/image';
import ViewDetailDialog from './ViewDetailDialog';

export default function TableReviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isViewDetailsDialog, setIsViewDetailsDialog] = useState({show:false,data:{}});

  const {data,isLoading} = useGetReviewQuery();
  const [UpdateReviewStatus] = useAsyncMutation(useUpdateReviewMutation);

  const reviews = data?.data || [];

  const filteredReviews = reviews.filter((review) => {
    if (ratingFilter !== 'all' && review.rating !== parseInt(ratingFilter)) return false;
    return (
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleUpdateStatus = async (id, status) => {
    await UpdateReviewStatus({id, status});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search reviews"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Rating: {ratingFilter === 'all' ? 'All' : `${ratingFilter} stars`}
                  <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} block w-full px-4 py-2 text-left text-sm`}
                        onClick={() => setRatingFilter('all')}
                      >
                        All Ratings
                      </button>
                    )}
                  </Menu.Item>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Menu.Item key={rating}>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} block w-full px-4 py-2 text-left text-sm`}
                          onClick={() => setRatingFilter(rating.toString())}
                        >
                          {rating} stars
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Review
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredReviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image height={50} width={50} 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={review.product.imageCover || review.images[0]} 
                        alt={review.product.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.product.name.length > 20 
                          ? `${review.product.name.substring(0, 20)}...` 
                          : review.product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image height={50} width={50} 
                        className="h-10 w-10 rounded-full" 
                        src={review.user.imgUrl} 
                        alt={review.user.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{review.user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{review.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {renderStars(review.rating)}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-sm text-gray-500 dark:text-gray-300">
                    {review.review}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(review.status)}`}>
                        <span className="mr-1">{getStatusIcon(review.status)}</span>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                        <ChevronDown className="ml-1 h-3 w-3" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleUpdateStatus(review._id, 'pending')}
                              className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} w-full px-4 py-2 text-left text-sm flex items-center`}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Pending
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleUpdateStatus(review._id, 'approved')}
                              className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} w-full px-4 py-2 text-left text-sm flex items-center`}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approved
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleUpdateStatus(review._id, 'rejected')}
                              className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''}  w-full px-4 py-2 text-left text-sm flex items-center`}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejected
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button 
                    onClick={() => setIsViewDetailsDialog({show:true,data:review})}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 dark:bg-gray-700">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReviews.length}</span> of{' '}
            <span className="font-medium">{reviews.length}</span> results
          </div>
        </div>
      </div>

      {isViewDetailsDialog.show && (
        <ViewDetailDialog show={isViewDetailsDialog.show} onClose={() => setIsViewDetailsDialog({show:false,data:{}})} data={isViewDetailsDialog.data} />
      )}
    </div>
  );
}