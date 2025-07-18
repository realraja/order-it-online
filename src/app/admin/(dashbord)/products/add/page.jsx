"use client"
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddProductMutation, useGetCategoryQuery } from '@/redux/api/admin';
import { CheckIcon, ChevronsUpDownIcon, IndianRupee, ListRestart, MoveLeft, MoveRight } from 'lucide-react';
import React, { useState } from 'react'
import { FiBox, FiImage, FiUpload } from 'react-icons/fi';
import { Listbox } from '@headlessui/react';
import Image from 'next/image';
import ImageSelectDialog from '@/components/admin/SelectImageModel';
import Link from 'next/link';

function ProductAddUpdateDeleteProductDialog({ type = 'add', data, isOpen, onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [status, setStatus] = useState('active');
    const [images, setImages] = useState([]);
    const [imageCover, setImageCover] = useState('');

    const [isSeletImageDialog, setIsSeletImageDialog] = useState({ isOpen: false, isSingle: false });

    const { data: categoryData } = useGetCategoryQuery();




    // Transform category data for the select component
    const categories = categoryData?.data?.map(cat => ({
        id: cat._id,
        name: cat.name,
        image: cat.image,
        status: cat.status
    })) || [];

    // Find the selected category object
    const selectedCategory = categories.find(cat => cat.id === category) || null;
    const [addProduct] = useAsyncMutation(useAddProductMutation);

    const handleSubmit = async () => {

        try {
            await addProduct({
                name,
                images,
                status,
                description,
                price,
                discountPrice,
                category,
                brand,
                quantity,
                imageCover
            }, 'Adding Product');

        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div>
            <div className="flex items-center gap-3 mx-5">
                <Link
                    href={'/admin/products'}
                    className="inline-flex items-center rounded-md cursor-pointer border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                >
                    <MoveLeft />
                    Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>

            </div>
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Product Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                    placeholder="Enter product name"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 min-h-[120px]"
                                placeholder="Product description..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Price & Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category & Brand */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <Listbox value={category} onChange={setCategory}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2.5 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 shadow-sm sm:text-sm">
                                            <div className="flex items-center space-x-1">
                                                {selectedCategory?.image && (
                                                    <Image
                                                        src={selectedCategory.image}
                                                        alt={selectedCategory.name}
                                                        height={50}
                                                        width={50}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                )}
                                                <span className={`block truncate text-gray-900 dark:text-gray-100 ${selectedCategory?.status === 'inactive' && 'text-red-1'} `}>
                                                    {selectedCategory?.name || 'Select a category'}
                                                </span>

                                            </div>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronsUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                                            {categories.map((category) => (
                                                <Listbox.Option
                                                    key={category.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none ${category.status === 'inactive' && 'text-red-1'} py-2 ${active ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                                                        }`
                                                    }
                                                    value={category.id}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <div className="flex items-center space-x-3">
                                                                {category.image && (
                                                                    <Image
                                                                        src={category.image}
                                                                        alt={category.name}
                                                                        height={50}
                                                                        width={50}
                                                                        className="h-6 w-6 rounded-full object-cover"
                                                                    />
                                                                )}
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {category.name}
                                                                </span>
                                                            </div>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                    placeholder="Brand"
                                />
                            </div>
                        </div>

                        {/* Quantity & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quantity
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiBox className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
                    {/* Product Images Section */}
                    <div className={`${images.length > 0 ? 'bg-green-400' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}>
                        <div className="flex items-center justify-betweenmb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Images</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upload multiple product images</p>
                            </div>
                            <button
                                onClick={() => setIsSeletImageDialog({ isOpen: true, isSingle: false })}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FiUpload className="mr-2 h-4 w-4" />
                                Select Images
                            </button>
                        </div>
                    </div>

                    {/* Cover Image Section */}
                    <div className={`${imageCover ? 'bg-green-400' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}>
                        <div className="flex items-center justify-between mb-3">
                            {imageCover ? <Image height={100} width={100} className='h-16 w-16' alt='coverimage' src={imageCover} /> : <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cover Image</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Main product display image</p>
                            </div>}
                            <button
                                onClick={() => setIsSeletImageDialog({ isOpen: true, isSingle: true })}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FiImage className="mr-2 h-4 w-4" />
                                Select Image
                            </button>
                        </div>


                    </div>

                </div>
                    <div className='flex justify-between'>

                        <button
                            onClick={()=>{
                                setName('')
                                setDescription('')
                                setBrand('')
                                setImages([])
                                setImageCover('')
                                setPrice(0)
                                setDiscountPrice(0)
                                setStatus('active')
                                setCategory('')
                                setQuantity(0)
                            }}
                            type="button"
                            className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                        >
                            <ListRestart />
                            Reset
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                        >
                            Submit
                            <MoveRight />
                        </button>
                    </div>

            </div>


            <ImageSelectDialog
                isSingle={isSeletImageDialog.isSingle}
                isOpen={isSeletImageDialog.isOpen}
                onClose={() => setIsSeletImageDialog({ isOpen: false, isSingle: false })}
                onSubmit={(selectedImages) => Array.isArray(selectedImages) ? setImages(selectedImages) : setImageCover(selectedImages)}
                alreadySelected={isSeletImageDialog?.isSingle ? imageCover : images}
            />


        </div>
    );
}

export default ProductAddUpdateDeleteProductDialog;