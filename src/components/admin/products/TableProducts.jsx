"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { useGetCategoryQuery, useGetProductQuery } from "@/redux/api/admin";
import UsersTableLoader from "../loaders/userTableLoader";
import Image from "next/image";
import ProductAddUpdateDeleteProductDialog from "./ModelAddEditDeleteProduct";

export default function TableProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialog, setIsDialog] = useState({
    show: false,
    data: {},
    type: "update",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedProducts, setExpandedProducts] = useState({}); // State to track expanded products

  const { data: productsData, isLoading: productsLoading } = useGetProductQuery();
  const { data: categoriesData } = useGetCategoryQuery();

  useEffect(() => {
    setProducts(productsData?.data || []);
    setCurrentPage(1);
  }, [productsData]);

  useEffect(() => {
    let result = [...(products || [])];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter((product) => product.status === selectedStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage) || 1;

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    return status === "active"
      ? `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      : `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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

  const getCategoryName = (categoryId) => {
    if (!categoriesData?.data) return "N/A";
    const category = categoriesData.data.find((cat) => cat._id === categoryId);
    return category?.name || "N/A";
  };

  const toggleVariants = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full rounded-lg border border-gray-300 bg-white text-black py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-gray-300 bg-white text-black px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categoriesData?.data?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-gray-300 bg-white text-black px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {productsLoading ? (
          <UsersTableLoader />
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Image
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
                <th
                  onClick={() => requestSort("price")}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <SortIndicator columnKey="price" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Stock
                </th>
                <th
                  onClick={() => requestSort("status")}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIndicator columnKey="status" />
                  </div>
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {currentItems?.map((product) => (
                <Fragment key={product._id}>
                  <tr
                    
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="whitespace-nowrap px-2">
                      {product.imageCover ? (
                        <Image
                          height={50}
                          width={50}
                          src={product.imageCover}
                          alt={product.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-600">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        {product.isVariants && (
                          <button
                            onClick={() => toggleVariants(product._id)}
                            className="focus:outline-none"
                          >
                            <ChevronRight
                              className={`h-5 w-5 transform transition-transform ${
                                expandedProducts[product._id]
                                  ? "rotate-90"
                                  : ""
                              }`}
                            />
                          </button>
                        )}
                        <span>
                          {product.name.slice(0, 26)}
                          {product.name.length > 26 && "..."}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex flex-col">
                        <span className="text-red-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-green-600">
                          {formatPrice(product.discountPrice || product.price)}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {product.brand}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {product.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={getStatusBadge(product.status)}>
                        {product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() =>
                            setIsDialog({
                              show: true,
                              type: "update",
                              data: product,
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
                              data: product,
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
                  {product.isVariants &&
                    expandedProducts[product._id] &&
                    product.variants?.map((variant) => (
                      <tr
                        key={variant._id}
                        className="bg-gray-50 dark:bg-gray-700"
                      >
                        <td className="whitespace-nowrap px-2 pl-8">
                          {variant.imageCover ? (
                            <Image
                              height={50}
                              width={50}
                              src={variant.imageCover}
                              alt={variant.name}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-600">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"> 
                          {variant.variantType}: {variant.variantName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span className="text-red-500 line-through">
                              {formatPrice(variant.price)}
                            </span>
                            <span className="text-green-600">
                              {formatPrice(
                                variant.discountPrice || variant.price
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {getCategoryName(variant.category)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {variant.brand}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {variant.quantity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={getStatusBadge(variant.status)}>
                            {variant.status.charAt(0).toUpperCase() +
                              variant.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() =>
                                setIsDialog({
                                  show: true,
                                  type: "update",
                                  data: variant,
                                })
                              }
                              className="rounded-full cursor-pointer p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-600"
                              title="Edit Variant"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                setIsDialog({
                                  show: true,
                                  type: "delete",
                                  data: variant,
                                })
                              }
                              className="rounded-full cursor-pointer p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
                              title="Delete Variant"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {filteredProducts?.length ? indexOfFirstItem + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredProducts?.length || 0)}
            </span>{" "}
            of <span className="font-medium">{filteredProducts?.length || 0}</span>{" "}
            products
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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
        <ProductAddUpdateDeleteProductDialog
          isOpen={isDialog.show}
          onClose={() => setIsDialog({ show: false, type: "update", data: {} })}
          data={isDialog.data}
          type={isDialog.type}
        />
      )}
    </div>
  );
}