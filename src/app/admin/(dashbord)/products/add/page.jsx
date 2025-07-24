"use client"
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddProductMutation, useGetCategoryQuery } from '@/redux/api/admin';
import { CheckIcon, ChevronsUpDownIcon, IndianRupee, ListRestart, MoveLeft, MoveRight, Plus, X } from 'lucide-react';
import React, { useState } from 'react'
import { FiBox, FiImage, FiUpload } from 'react-icons/fi';
import { Listbox } from '@headlessui/react';
import Image from 'next/image';
import ImageSelectDialog from '@/components/admin/SelectImageModel';
import Link from 'next/link';

function ProductAddUpdateDeleteProductDialog() {
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
    const [tags, setTags] = useState(['']);

    const [isVariants, setIsVariants] = useState(false);
    const [isVariantsImage, setIsVariantsImage] = useState(false);
    const [variantType, setVariantType] = useState('');
    const [variantNameImages, setVariantNameImages] = useState([{ name: '', image: '' }]);

    const [isSeletImageDialog, setIsSeletImageDialog] = useState({ 
        isOpen: false, 
        isSingle: false,
        variantIndex: null 
    });

    const { data: categoryData } = useGetCategoryQuery();

    const categories = categoryData?.data?.map(cat => ({
        id: cat._id,
        name: cat.name,
        image: cat.image,
        status: cat.status
    })) || [];

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
                imageCover,
                tags: tags.filter(tag => tag.trim() !== ''),
                isVariants,
                isVariantsImage,
                variantType,
                variantNameImages: variantNameImages.filter(v => v.name.trim() !== '')
            }, 'Adding Product');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addVariant = () => {
        setVariantNameImages([...variantNameImages, { name: '', image: '' }]);
    };

    const removeVariant = (index) => {
        const updated = [...variantNameImages];
        updated.splice(index, 1);
        setVariantNameImages(updated);
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variantNameImages];
        updated[index][field] = value;
        setVariantNameImages(updated);
    };

    const handleVariantImageSelect = (index) => {
        setIsSeletImageDialog({ 
            isOpen: true, 
            isSingle: true,
            variantIndex: index 
        });
    };

    const handleImageSelect = (selectedImages) => {
        if (isSeletImageDialog.variantIndex !== null) {
            const index = isSeletImageDialog.variantIndex;
            updateVariant(index, 'image', selectedImages);
        } else if (isSeletImageDialog.isSingle) {
            setImageCover(selectedImages);
        } else {
            setImages(selectedImages);
        }
        setIsSeletImageDialog({ isOpen: false, isSingle: false, variantIndex: null });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href={'/admin/products'}
                    className="inline-flex items-center rounded-md cursor-pointer border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                >
                    <MoveLeft />
                    Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 min-h-[120px]"
                                placeholder="Product description..."
                                rows={3}
                                required
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tags.join(',')}
                                onChange={(e) => setTags(e.target.value.split(','))}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                placeholder="tag1,tag2,tag3"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Price & Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Price *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category & Brand */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
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
                                                <span className={`block truncate text-gray-900 dark:text-gray-100 ${selectedCategory?.status === 'inactive' && 'text-red-500'}`}>
                                                    {selectedCategory?.name || 'Select a category'}
                                                </span>
                                            </div>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" />
                                            </span>
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                                            {categories.map((category) => (
                                                <Listbox.Option
                                                    key={category.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 ${active ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'} ${category.status === 'inactive' && 'text-red-500'}`
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
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    {category.name}
                                                                </span>
                                                            </div>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                                                    <CheckIcon className="h-5 w-5" />
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
                                    Brand *
                                </label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                    placeholder="Brand"
                                    required
                                />
                            </div>
                        </div>

                        {/* Quantity & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quantity *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiBox className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Images */}
                    <div className={`p-4 rounded-lg border ${images.length > 0 ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Images *</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upload multiple product images</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSeletImageDialog({ isOpen: true, isSingle: false, variantIndex: null })}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FiUpload className="mr-2 h-4 w-4" />
                                Select Images
                            </button>
                        </div>
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                        <Image
                                            src={img}
                                            alt={`Product image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className={`p-4 rounded-lg border ${imageCover ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                        <div className="flex items-center justify-between mb-3">
                            {imageCover ? (
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                    <Image
                                        src={imageCover}
                                        alt="Cover image"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cover Image *</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Main product display image</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsSeletImageDialog({ isOpen: true, isSingle: true, variantIndex: null })}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FiImage className="mr-2 h-4 w-4" />
                                Select Image
                            </button>
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Variants</h3>
                        <div className="flex items-center gap-3">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isVariants}
                                    onChange={(e) => setIsVariants(e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Variants</span>
                            </label>
                            {isVariants && (
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isVariantsImage}
                                        onChange={(e) => setIsVariantsImage(e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Different Images</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {isVariants && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Variant Type *
                                </label>
                                <input
                                    type="text"
                                    value={variantType}
                                    onChange={(e) => setVariantType(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                    placeholder="e.g. Color, Size, etc."
                                    required={isVariants}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Variants *
                                </label>
                                {variantNameImages.map((variant, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={variant.name}
                                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                                                placeholder="Variant name"
                                                required={isVariants}
                                            />
                                        </div>
                                        {isVariantsImage && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVariantImageSelect(index)}
                                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiImage className="text-gray-500 dark:text-gray-400" />
                                                </button>
                                                {variant.image && (
                                                    <div className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                                        <Image
                                                            src={variant.image}
                                                            alt={`Variant ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {variantNameImages.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="inline-flex items-center rounded-md cursor-pointer border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Variant
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            setName('');
                            setDescription('');
                            setBrand('');
                            setImages([]);
                            setImageCover('');
                            setPrice(0);
                            setDiscountPrice(0);
                            setStatus('active');
                            setCategory('');
                            setQuantity(0);
                            setIsVariants(false);
                            setVariantType('');
                            setVariantNameImages([{ name: '', image: '' }]);
                        }}
                        className="inline-flex items-center rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                    >
                        <ListRestart className="w-5 h-5" />
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center rounded-md cursor-pointer border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-2"
                    >
                        Submit
                        <MoveRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <ImageSelectDialog
                isSingle={isSeletImageDialog.isSingle}
                isOpen={isSeletImageDialog.isOpen}
                onClose={() => setIsSeletImageDialog({ isOpen: false, isSingle: false, variantIndex: null })}
                onSubmit={handleImageSelect}
                alreadySelected={isSeletImageDialog.isSingle ? 
                    (isSeletImageDialog.variantIndex !== null ? 
                        variantNameImages[isSeletImageDialog.variantIndex]?.image : 
                        imageCover) : 
                    images}
            />
        </div>
    );
}

export default ProductAddUpdateDeleteProductDialog;