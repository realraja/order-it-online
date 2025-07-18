import DialogContext from '@/components/ui/DailogContext'
import { useAsyncMutation } from '@/hook/mutationHook';
import { useDeleteImageMutation, useUpdateImageMutation, useAddImageMutation } from '@/redux/api/admin';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react'
import { FiEdit, FiPlus, FiTrash, FiUpload, FiX, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

function AddUpdateDeleteDialog({ type = 'add', data, isOpen, onClose }) {
    const [name, setName] = useState('');
    const [pin, setPin] = useState(false);
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [id, setId] = useState('');
    const fileInputRef = useRef(null);

    // console.log(data,imagePreview);

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setImage(data?.url || '');
            setImagePreview(data?.url || '');
            setPin(data?.pin || false);
            setId(data?._id || '');
        }
    }, [data]);

    const [updateImage] = useAsyncMutation(useUpdateImageMutation);
    const [deleteImage] = useAsyncMutation(useDeleteImageMutation);
    const [addImage] = useAsyncMutation(useAddImageMutation);

    const handleSubmit = async () => {
        const payload = type === 'delete'
            ? { id }
            : {
                name,
                pin: pin ? true : false,
                image: imagePreview,
                ...(type === 'update' && { id })
            };

        const successMessage = {
            add: 'Image added successfully',
            update: 'Image updated successfully',
            delete: 'Image deleted successfully'
        }[type];

            onClose();


        try {
            if (type === 'add') {
                await addImage(payload, successMessage);
            } else if (type === 'update') {
                await updateImage(payload, successMessage);
            } else if (type === 'delete') {
                await deleteImage(payload, successMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleImageChange = (file) => {
        if (file && file.size > 2 * 1024 * 1024) {
            toast('File size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
            submitText={`${actionText} Image`}
            title={`${actionText} Image`}
            Icon={type === 'add' ? FiPlus : type === 'update' ? FiEdit : FiTrash}
            submitButtonVariant={type === 'delete' ? 'danger' : 'primary'}
        >
            {type === 'delete' ? (
                <div className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <FiTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Delete Image
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{name}"</span>? This action cannot be undone.
                    </p>
                </div>
            ) : (
                <div className="space-y-6 p-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onClick={(e) => e.target.select()}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Enter image name"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pin Image
                        </label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setPin(!pin)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${pin ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pin ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="ml-3 flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <FiStar className={`mr-1 h-4 w-4 ${pin ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                                {pin ? 'Pinned' : 'Not Pinned'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image Upload
                        </label>
                        <div
                            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                } bg-white dark:bg-gray-800 cursor-pointer overflow-hidden`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={(e) => {
                                if (e.target.tagName !== 'BUTTON') {
                                    fileInputRef.current?.click();
                                }
                            }}
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
                                    <Image
                                        height={50}
                                        width={50}
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-gray-700/90 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                                    >
                                        <FiX size={18} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <FiUpload className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Drag & drop an image here, or click to select
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        Supports JPG, PNG (Max. 2MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        {isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-xl pointer-events-none z-10">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                                    <FiUpload className="mx-auto w-8 h-8 text-blue-500 mb-3" />
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop to upload</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DialogContext>
    );
}

export default AddUpdateDeleteDialog;
