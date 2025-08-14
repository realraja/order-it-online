'use client';
import { Fragment, useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Truck, CheckCircle, X, Trash2, RefreshCw, CreditCard } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useDeleteOrderMutation, useGetOrderQuery, useUpdateOrderMutation} from '@/redux/api/admin';
import { useAsyncMutation } from '@/hook/mutationHook';
import DialogContext from '@/components/ui/DailogContext';
import ViewOrderDetailsDialog from './ViewOrderDialog';
import Image from 'next/image';

export default function TableOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({show:false,deleteId:''});
  const [viewOrderDialog, setViewOrderDialog] = useState({show:false,data:{}});

  const { data, isLoading } = useGetOrderQuery();
  const [updateOrder] = useAsyncMutation(useUpdateOrderMutation);
  const [deleteOrder] = useAsyncMutation(useDeleteOrderMutation);

  useEffect(() => {
    if (data) {
      setOrders(data.data || []);
    }
  }, [data]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false;
    return (
      order.item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: <span className="h-2 w-2 rounded-full bg-yellow-500" /> },
    { value: 'processing', label: 'Processing', icon: <RefreshCw className="h-4 w-4 text-blue-500" /> },
    { value: 'shipped', label: 'Shipped', icon: <Truck className="h-4 w-4 text-purple-500" /> },
    { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
    { value: 'cancelled', label: 'Cancelled', icon: <X className="h-4 w-4 text-red-500" /> }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'refunded', label: 'Refunded', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[status] || statusMap['cancelled']}`;
  };

  const handleStatusChange = async (orderId, newStatus, paymentStatus) => {
    try {
      await updateOrder({ 
        id: orderId, 
        orderStatus: newStatus,
        paymentStatus
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder({id:orderId});
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      {/* Search and filter controls */}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Menu as="div" className="relative inline-block z-50 text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} block w-full px-4 py-2 text-left text-sm`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All Statuses
                    </button>
                  )}
                </Menu.Item>
                {statusOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' : ''} flex items-center w-full px-4 py-2 text-left text-sm`}
                        onClick={() => setStatusFilter(option.value)}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Item
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Payment
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="whitespace-nowrap px-6 py-4 ">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image height={50} width={50} className="h-10 w-10 rounded-full" src={order.item.product?.imageCover} alt={order.user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.item.product?.name.length > 20 
                      ? `${order.item.product?.name.substring(0, 20)}...` 
                      : order.item.product?.name}
                  </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">₹{order.totalAmount} × {order.item.quantity}</div>
                    </div>
                  </div>
                  
                  
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image height={50} width={50} className="h-10 w-10 rounded-full" src={order.user.imgUrl} alt={order.user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{order.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className={`${getStatusBadge(order.orderStatus)} cursor-pointer inline-flex items-center`}>
                        <span className="mr-1">
                          {statusOptions.find(opt => opt.value === order.orderStatus)?.icon}
                        </span>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                      <div className="py-1">
                        {statusOptions.map((option) => (
                          <Menu.Item key={option.value}>
                            {({ active }) => (
                              <button
                                onClick={() => handleStatusChange(order._id, option.value, order.paymentStatus)}
                                className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                              >
                                <span className="mr-2">{option.icon}</span>
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        <CreditCard className="mr-1 h-3 w-3" />
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                      <div className="py-1">
                        {paymentStatusOptions.map((option) => (
                          <Menu.Item key={option.value}>
                            {({ active }) => (
                              <button
                                onClick={() => handleStatusChange(order._id, order.orderStatus, option.value)}
                                className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                              >
                                <span className={`mr-2 h-2 w-2 rounded-full ${option.color.split(' ')[0]}`} />
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
                <td className="whitespace-nowrap gap-3 flex justify-center items-center px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => setViewOrderDialog({data:order,show:true})}
                    className="text-indigo-600 cursor-pointer hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="View order"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteDialog({deleteId:order._id,show:true})}
                    className="text-red-600 hover:text-red-900 cursor-pointer dark:text-red-400 dark:hover:text-red-300"
                    title="Delete order"
                  >
                    <Trash2 className="h-5 w-5" />
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{filteredOrders.length}</span> results
          </div>
        </div>
      </div>

      {confirmDeleteDialog.show && (
        <DialogContext 
          showDialog={confirmDeleteDialog.show} 
          onClose={()=> setConfirmDeleteDialog({show:false,deleteId:''})} 
          onSubmit={()=> {handleDeleteOrder(confirmDeleteDialog.deleteId); setConfirmDeleteDialog({show:false,deleteId:''})}} 
          title={'Delete Order'} 
          Icon={Trash2} 
          submitText='Delete' 
          children={<div>Are you sure you want to delete?</div>} 
        />
      )}
      {viewOrderDialog.show && (
        <ViewOrderDetailsDialog 
          isOpen={viewOrderDialog.show} 
          data={viewOrderDialog.data} 
          onClose={()=> setViewOrderDialog({show:false,data:{}})} 
        />
      )}
    </div>
  );
}