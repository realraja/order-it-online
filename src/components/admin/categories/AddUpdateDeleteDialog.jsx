import DialogContext from '@/components/ui/DailogContext'
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/admin';
import React, { useState, useRef, useEffect } from 'react'
import { FiEdit, FiPlus, FiTrash, FiUpload, FiX } from 'react-icons/fi';

function AddUpdateDeleteDialog({ type = 'add', data, isOpen, onClose }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('active');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [id, setId] = useState('')
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data) {
            setName(data?.name);
            setImage(data?.image);
            setImagePreview(data?.image);
            setStatus(data?.status);
            setId(data?._id)
        }
        // console.log(data)
    }, [data]);

    const [addCategory] = useAsyncMutation(useAddCategoryMutation);
    const [updateCategory] = useAsyncMutation(useUpdateCategoryMutation);
    const [deleteCategory] = useAsyncMutation(useDeleteCategoryMutation);

    const handleSubmit = async () => {
        onClose();
        if (type === 'add') {
            await addCategory({ name, status, image }, 'Adding Category');
        } else if (type === 'update') {
            await updateCategory({ id: id, name, status, image }, 'Updating Category');
        } else if (type === 'delete') {
            await deleteCategory({ id: id }, 'Deleting Category');
        }
    };

    const handleImageChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageChange(file);
    };

    const removeImage = () => {
        setImagePreview('');
        setImage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const actionText = type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <DialogContext
            showDialog={isOpen}
            onClose={() => onClose(false)}
            onSubmit={handleSubmit}
            submitText={`${actionText} Category`}
            title={`${actionText} Category`}
            Icon={type === 'add' ? FiPlus : type === 'update' ? FiEdit : FiTrash}
        >
            {type === 'delete' ? (
                <div className="p-4 text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        Are you sure you want to delete this category?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        "{name}" will be permanently removed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 p-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600 dark:text-blue-500"
                                    name="status"
                                    value="active"
                                    checked={status === 'active'}
                                    onChange={() => setStatus('active')}
                                />
                                <span className="ml-2 dark:text-gray-300">Active</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600 dark:text-blue-500"
                                    name="status"
                                    value="inactive"
                                    checked={status === 'inactive'}
                                    onChange={() => setStatus('inactive')}
                                />
                                <span className="ml-2 dark:text-gray-300">Inactive</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Image
                        </label>
                        <div
                            className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition-all ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'} bg-white dark:bg-gray-800`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileInputChange}
                                accept="image/*"
                            />
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FiX size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <FiUpload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Drag & drop an image here, or click to select
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        JPG, PNG (Max. 2MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        {isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 rounded-lg pointer-events-none">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                                    <FiUpload className="mx-auto w-6 h-6 text-blue-500 mb-2" />
                                    <p className="text-sm font-medium">Drop to upload</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DialogContext>
    )
}

export default AddUpdateDeleteDialog