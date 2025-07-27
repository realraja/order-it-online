'use client'
import { useGetNotificationQuery, useSetNotificationReadedMutation } from '@/redux/api/admin'
import {  useEffect, useState } from 'react';
import { Search, Bell, Mail, User, Trash2, Edit, Send } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import AddUpdateDeleteNotificationDialog from '@/components/admin/notification/AddUpdateDeleteNotification';

function NotificationPage() {
    const { data, isLoading } = useGetNotificationQuery();
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSendDialogOpen, setIsSendDialogOpen] = useState({ show: false, type: 'add', data: {} });

    const [SetNotificationReaded] = useSetNotificationReadedMutation();

    useEffect(() => {
        const setReaded = async () => {
            await SetNotificationReaded()
        }

        setReaded()
    }, [])

    const notifications = data?.data || [];
    const filteredNotifications = notifications.filter(notification => {
        if (activeTab !== 'all' && notification.type !== activeTab) return false;
        return (
            notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Send Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setIsSendDialogOpen({ show: true, type: 'add', data: {} })}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
                    >
                        <Send size={18} />
                        Send Notification
                    </button>

                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('all')}
                >
                    <Bell size={16} />
                    All Notifications
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'user' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('user')}
                >
                    <User size={16} />
                    User Notifications
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('admin')}
                >
                    <Mail size={16} />
                    Admin Notifications
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg shadow dark:bg-gray-800 overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No notifications found
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredNotifications.map((notification) => (
                            <li key={notification._id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            {notification.type === 'user' ? (
                                                <div className="relative">
                                                    <Image
                                                        src={notification.user?.imgUrl || 'https://res.cloudinary.com/dwc3gwskl/image/upload/v1721379013/samples/ecommerce/fiiijyy4cq1nrcp7t4zz.jpg'}
                                                        alt={notification?.email || 'image'}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full h-10 w-10 object-cover"
                                                    />
                                                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                                                </div>
                                            ) : (
                                                <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                                                    <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {notification.type === 'user' ? notification.user?.name || notification?.email || 'User' : 'System Admin'}
                                                </p>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {notification.type}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!notification.isRead && (
                                            <button
                                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsSendDialogOpen({ show: true, type: 'update', data: notification })}
                                            className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => setIsSendDialogOpen({ show: true, type: 'delete', data: notification })}
                                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {
                isSendDialogOpen.show && <AddUpdateDeleteNotificationDialog isOpen={isSendDialogOpen.show} onClose={()=> setIsSendDialogOpen({show:false,type:'add',data:{}})} data={isSendDialogOpen.data} type={isSendDialogOpen.type} />
            }
        </div>
    );
}

export default NotificationPage;