"use client";
import { useCallback, useEffect, useState } from "react";
import {
    Edit,
    Trash2,
    ChevronUp,
    ChevronDown,
    Search,
    Image as ImageIcon,
    Pin,
    Table,
    Grid,
} from "lucide-react";
import UsersTableLoader from "../loaders/userTableLoader";
import AddUpdateDeleteDialog from "./ImageDialog";
import { useGetImageQuery } from "@/redux/api/admin";
import Image from "next/image";
import { toast } from "react-toastify";

export default function TableImages() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDialog, setIsDialog] = useState({
        show: false,
        data: {},
        type: "update",
    });
    const [viewMode, setViewMode] = useState("grid"); // 'table' or 'grid'
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const { data, isLoading } = useGetImageQuery();

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        setImages(data?.data || []);
        setCurrentPage(1);
    }, [data]);

    const filteredImages = images?.filter((image) =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredImages?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredImages?.length / itemsPerPage) || 1;

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey)
            return <ChevronUp className="h-4 w-4 opacity-0" />;
        return sortConfig.direction === "ascending" ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "table" ? "grid" : "table");
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
            // Prevent dragenter on window from triggering when dragging over child elements
            if (e.target === document.documentElement) {
                handleDragEnter(e);
            }
        };

        const handleWindowDragLeave = (e) => {
            // Only trigger if leaving the window
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
        <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 ${isDragging ? 'ring-2 ring-indigo-500' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Drop zone overlay */}
            {isDragging && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none"
                >
                    <div className="rounded-lg bg-white p-8 text-center dark:bg-gray-800 pointer-events-auto">
                        <ImageIcon className="mx-auto h-12 w-12 text-indigo-500" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            Drop your image here
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-300">
                            Upload an image by dropping it anywhere on this page
                        </p>
                    </div>
                </div>
            )}

            {/* Rest of your component remains the same */}
            <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="relative w-full md:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search images..."
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={toggleViewMode}
                        className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        title={`Switch to ${viewMode === "table" ? "grid" : "table"} view`}
                    >
                        {viewMode === "table" ? (
                            <Grid className="h-5 w-5" />
                        ) : (
                            <Table className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <UsersTableLoader />
                ) : viewMode === "table" ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Preview
                                </th>

                                <th
                                    onClick={() => requestSort("name")}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Name</span>
                                        <SortIndicator columnKey="name" />
                                    </div>
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Pinned
                                </th>

                                <th
                                    onClick={() => requestSort("createdAt")}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Uploaded</span>
                                        <SortIndicator columnKey="createdAt" />
                                    </div>
                                </th>

                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {currentItems?.map((image) => (
                                <tr
                                    key={image._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="h-16 w-16 overflow-hidden rounded-md">
                                            <Image
                                                height={50}
                                                width={50}
                                                src={image.url}
                                                alt={image.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                                        {image.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {image.pin ? (
                                            <Pin className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <Pin className="h-5 w-5 text-gray-400" />
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {formatDate(image.createdAt)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button
                                                onClick={() =>
                                                    setIsDialog({
                                                        show: true,
                                                        type: "update",
                                                        data: image,
                                                    })
                                                }
                                                className="rounded-full cursor-pointer p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-600"
                                                title="Edit"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsDialog({
                                                        show: true,
                                                        type: "delete",
                                                        data: image,
                                                    })
                                                }
                                                className="rounded-full cursor-pointer p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {currentItems?.map((image) => (
                            <div
                                key={image._id}
                                className="relative group rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-600"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                        height={50}
                                        width={50}
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                {image.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                {formatDate(image.createdAt)}
                                            </p>
                                        </div>
                                        {image.pin && (
                                            <Pin className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        )}
                                    </div>
                                    <div className="mt-3 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() =>
                                                setIsDialog({
                                                    show: true,
                                                    type: "update",
                                                    data: image,
                                                })
                                            }
                                            className="rounded-full cursor-pointer p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-600"
                                            title="Edit"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsDialog({
                                                    show: true,
                                                    type: "delete",
                                                    data: image,
                                                })
                                            }
                                            className="rounded-full cursor-pointer p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
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
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                Items per page:
                            </span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                {[5, 10, 20, 50].map((n) => (
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
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            <span className="px-2 text-sm text-gray-500 dark:text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
    );
}