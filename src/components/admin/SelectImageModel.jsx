"use client";
import { useCallback, useEffect, useState } from "react";
import { Edit, Trash2, Search, Image as ImageIcon, Pin, Check, Plus } from "lucide-react";
import { useGetImageQuery } from "@/redux/api/admin";
import Image from "next/image";
import DialogContext from "../ui/DailogContext";
import { FiImage } from "react-icons/fi";
import AddUpdateDeleteDialog from "./image/ImageDialog";

export default function ImageSelectDialog({ isSingle = false, isOpen, onClose, onSubmit, alreadySelected }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(() => {
        if (isSingle) {
            return alreadySelected || null;
        } else {
            return Array.isArray(alreadySelected) ? alreadySelected : [];
        }
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [isDialog, setIsDialog] = useState({
        show: false,
        data: {},
        type: "update",
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const { data, isLoading } = useGetImageQuery();

    useEffect(() => {
        if (isSingle) {
            setSelectedImages(alreadySelected || null);
        } else {
            setSelectedImages(Array.isArray(alreadySelected) ? alreadySelected : []);
        }
    }, [alreadySelected, isSingle]);

    useEffect(() => {
        setImages(data?.data || []);
        setCurrentPage(1);
    }, [data]);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const filteredImages = images?.filter((image) =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredImages?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredImages?.length / itemsPerPage) || 1;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleImageSelect = (image) => {
        if (isSingle) {
            setSelectedImages(image.url === selectedImages ? null : image.url);
        } else {
            setSelectedImages(prev => {
                if (prev.includes(image.url)) {
                    return prev.filter(url => url !== image.url);
                } else {
                    return [...prev, image.url];
                }
            });
        }
    };

    const isSelected = (imageUrl) => {
        return isSingle
            ? selectedImages === imageUrl
            : selectedImages?.includes(imageUrl);
    };

    const handleSubmit = () => {
        if (isSingle) {
            onSubmit(selectedImages);
        } else {
            onSubmit(selectedImages || []);
        }
        onClose();
    };

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev - 1);
        if (dragCounter <= 1) {
            setIsDragging(false);
        }
    }, [dragCounter]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(0);
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];

        if (file && file.size > 2 * 1024 * 1024) {
            toast('File size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setIsDialog({
                show: true,
                data: { name: file.name, url: reader.result, pin: false },
                type: "add",
            });
        };
        reader.readAsDataURL(file);
    }, []);

    useEffect(() => {
        const handleWindowDragEnter = (e) => {
            if (e.target === document.documentElement) {
                handleDragEnter(e);
            }
        };

        const handleWindowDragLeave = (e) => {
            if (e.target === document.documentElement) {
                handleDragLeave(e);
            }
        };

        window.addEventListener('dragenter', handleWindowDragEnter);
        window.addEventListener('dragleave', handleWindowDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleWindowDragEnter);
            window.removeEventListener('dragleave', handleWindowDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

    return (
        <DialogContext
            showDialog={isOpen}
            onClose={() => onClose(isSingle ? null : [])}
            submitText={`Select ${isSingle ? 'Image' : `${selectedImages?.length || 0} Images`}`}
            onSubmit={handleSubmit}
            title={isSingle ? 'Select Image' : 'Select Images'}
            Icon={FiImage}
            isFullWidth={true}
            submitButtonVariant={selectedImages && (isSingle || selectedImages.length > 0) ? "primary" : "disabled"}
        >
            <div
                className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 ${isDragging ? 'ring-2 ring-purple-500' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {isDragging && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-none">
                        <div className="rounded-lg bg-white p-6 text-center dark:bg-gray-800 pointer-events-auto">
                            <ImageIcon className="mx-auto h-10 w-10 text-purple-500" />
                            <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
                                Drop your image here
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                                Upload an image by dropping it anywhere
                            </p>
                        </div>
                    </div>
                )}

                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-56">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search images..."
                            className="block w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                        {!isSingle && selectedImages?.length > 0 && (
                            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium dark:bg-purple-900/30 dark:text-purple-200">
                                {selectedImages.length} selected
                            </span>
                        )}
                        <button
                            onClick={() => setIsDialog({ show: true, data: {}, type: 'add' })}
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 gap-1.5"
                        >
                            <Plus size={16} />
                            Add Image
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-6 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3 sm:p-4">
                            {currentItems?.map((image) => (
                                <div
                                    key={image._id}
                                    onClick={() => handleImageSelect(image)}
                                    className={`relative group rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${isSelected(image.url)
                                        ? 'border-purple-500 ring-2 ring-purple-500'
                                        : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                >
                                    {isSelected(image.url) && (
                                        <div className="absolute top-1.5 right-1.5 z-10 bg-purple-500 rounded-full p-1">
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </div>
                                    )}
                                    <div className="aspect-square overflow-hidden relative">
                                        <Image
                                            fill
                                            src={image.url}
                                            alt={image.name}
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate text-xs sm:text-sm">
                                                    {image.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-300">
                                                    {formatDate(image.createdAt)}
                                                </p>
                                            </div>
                                            {image.pin && (
                                                <Pin className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </div>
                                        <div className="mt-2 flex justify-end space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDialog({
                                                        show: true,
                                                        type: "update",
                                                        data: image,
                                                    });
                                                }}
                                                className="rounded-full p-1 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-gray-600"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDialog({
                                                        show: true,
                                                        type: "delete",
                                                        data: image,
                                                    });
                                                }}
                                                className="rounded-full p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 px-4 sm:px-6 py-3 dark:bg-gray-700">
                    <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            Showing{" "}
                            <span className="font-medium">
                                {filteredImages?.length ? indexOfFirstItem + 1 : 0}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(indexOfLastItem, filteredImages?.length || 0)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">{filteredImages?.length || 0}</span>{" "}
                            images
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                                    Per page:
                                </span>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs sm:text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    {[8, 12, 24, 48].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    Previous
                                </button>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isDialog.show && (
                    <AddUpdateDeleteDialog
                        isOpen={isDialog.show}
                        onClose={() =>
                            setIsDialog({ show: false, type: "update", data: {} })
                        }
                        data={isDialog.data}
                        type={isDialog.type}
                    />
                )}
            </div>
        </DialogContext>
    );
}