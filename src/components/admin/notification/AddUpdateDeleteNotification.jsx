import DialogContext from '@/components/ui/DailogContext';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useDeleteNotificationMutation, useSendNotificationMutation, useUpdateNotificationMutation } from '@/redux/api/admin';
import React, { useState, useEffect } from 'react';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';

function AddUpdateDeleteNotificationDialog({ type = 'add', data, isOpen, onClose }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setTitle(data?.title || '');
            setMessage(data?.message || '');
        } else {
            // Reset form when opening for new notification
            setTitle('');
            setMessage('');
        }
    }, [data, isOpen]);

    const [addNotification] = useAsyncMutation(useSendNotificationMutation);
    const [updateNotification] = useAsyncMutation(useUpdateNotificationMutation);
    const [deleteNotification] = useAsyncMutation(useDeleteNotificationMutation);

    const handleSubmit = async () => {
        setIsLoading(true);
            onClose();
        try {
            if (type === 'add') {
                await addNotification({ 
                    title, 
                    message},'Adding Notification');
            } else if (type === 'update') {
                await updateNotification({ 
                    id: data._id, 
                    title, 
                    message
                }, 'Updating Notification');
            } else if (type === 'delete') {
                await deleteNotification({ id: data._id }, 'Deleting Notification');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const actionText = type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <DialogContext
            showDialog={isOpen}
            onClose={() => onClose(false)}
            onSubmit={handleSubmit}
            submitText={`${actionText} Notification`}
            title={`${actionText} Notification`}
            Icon={type === 'add' ? FiPlus : type === 'update' ? FiEdit : FiTrash}
            isLoading={isLoading}
        >
            {type === 'delete' ? (
                <div className="p-4 text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        Are you sure you want to delete this notification?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        "{title}" will be permanently removed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 p-4">
                   

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Notification title"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Notification message"
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                </div>
            )}
        </DialogContext>
    );
}

export default AddUpdateDeleteNotificationDialog;