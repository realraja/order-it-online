"use client";
import DialogContext from "@/components/ui/DailogContext";
import { useAsyncMutation } from "@/hook/mutationHook";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
  useAddProductMutation,
  useGetCategoryQuery,
} from "@/redux/api/admin";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  IndianRupee,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiPlus,
  FiTrash,
  FiBox,
  FiImage,
  FiUpload,
} from "react-icons/fi";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import ImageSelectDialog from "../SelectImageModel";

function ProductAddUpdateDeleteProductDialog({
  type = "add",
  data,
  isOpen,
  onClose,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [status, setStatus] = useState("active");
  const [images, setImages] = useState([]);
  const [imageCover, setImageCover] = useState("");
  const [id, setId] = useState("");
  const [isVariants, setIsVariants] = useState(false);
  const [variantType, setVariantType] = useState("");
  const [isVariantsImage, setIsVariantsImage] = useState(false);
  const [variantNameImages, setVariantNameImages] = useState([]);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantImage, setNewVariantImage] = useState("");
 
  const [variantName, setVariantName] = useState('')

  const [isSelectImageDialog, setIsSelectImageDialog] = useState({
    isOpen: false,
    isSingle: false,
    forVariant: false,
  });

  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetCategoryQuery();

  useEffect(() => {
    if (data) {
      setName(data?.name || "");
      setDescription(data?.description || "");
      setPrice(data?.price || 0);
      setDiscountPrice(data?.discountPrice || 0);
      setCategory(data?.category || "");
      setBrand(data?.brand || "");
      setQuantity(data?.quantity || 0);
      setStatus(data?.status || "active");
      setImages(data?.images || []);
      setImageCover(data?.imageCover || "");
      setId(data?._id || "");
      setIsVariants(data?.isVariants || false);
      setVariantType(data?.variantType || "");
      setIsVariantsImage(data?.isVariantsImage || false);
      // If editing a variant (child product), use variantName
      if(isChildProduct) setVariantName(data?.variantName);
      //  else {
      //   // For parent products, map variants to variantNameImages
      //   setVariantNameImages(
      //     data?.variants?.map((v) => ({
      //       id: v._id,
      //       name: v.variantName,
      //       image: v.imageCover,
      //     })) || []
      //   );
      // }
    }
  }, [data]);

  const categories =
    categoryData?.data?.map((cat) => ({
      id: cat._id,
      name: cat.name,
      image: cat.image,
      status: cat.status,
    })) || [];

  const selectedCategory = categories.find((cat) => cat.id === category) || null;

  const [updateProduct] = useAsyncMutation(useUpdateProductMutation);
  const [deleteProduct] = useAsyncMutation(useDeleteProductMutation);
  const [addProduct] = useAsyncMutation(useAddProductMutation);

  const handleAddVariant = () => {
    if (!newVariantName || (isVariantsImage && !newVariantImage)) {
      alert("Please provide a variant name and image (if variant images are enabled).");
      return;
    }
    if (variantNameImages.some((v) => v.name === newVariantName)) {
      alert("Variant names must be unique.");
      return;
    }
    setVariantNameImages([
      ...variantNameImages,
      {
        name: newVariantName,
        image: isVariantsImage ? newVariantImage : imageCover,
      },
    ]);
    setNewVariantName("");
    setNewVariantImage("");
  };

  const handleRemoveVariant = (index) => {
    setVariantNameImages(variantNameImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Basic client-side validation
    if (
      !name ||
      !images.length ||
      !status ||
      !description ||
      !price ||
      !discountPrice ||
      !category ||
      !brand ||
      !quantity ||
      !imageCover
    ) {
      alert("Please fill all required fields!");
      return;
    }
    // if (isVariants && (!variantType || !variantNameImages.length)) {
    //   alert("Please provide variant type and at least one variant.");
    //   return;
    // }

    const payload = type === "delete"
      ? { id }
      : {
        name,
        description,
        price,
        discountPrice,
        category,
        brand,
        quantity,
        status,
        images,
        imageCover,
        isVariants,
        variantType,
        isVariantsImage,
        variantNameImages: isVariants ? variantNameImages : [],
        ...(type === "update" && { id,variantName }),
        // If editing a variant, include variantName
        // ...(data?.isChildProduct && { variantName: variantNameImages[0]?.name || "" }),
      };

    const successMessage = {
      add: "Product added successfully",
      update: data?.isChildProduct ? "Variant updated successfully" : "Product updated successfully",
      delete: data?.isChildProduct ? "Variant deleted successfully" : "Product deleted successfully",
    }[type];

    try {
      if (type === "add") {
        await addProduct(payload, successMessage);
      } else if (type === "update") {
        await updateProduct(payload, successMessage);
      } else if (type === "delete") {
        await deleteProduct(payload, successMessage);
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const actionText = type.charAt(0).toUpperCase() + type.slice(1);
  const isChildProduct = data?.isChildProduct;

  return (
    <DialogContext
      showDialog={isOpen}
      onClose={() => onClose(false)}
      onSubmit={handleSubmit}
      submitText={`${actionText} ${isChildProduct ? "Variant" : "Product"}`}
      title={`${actionText} ${isChildProduct ? "Variant" : "Product"}`}
      Icon={type === "add" ? FiPlus : type === "update" ? FiEdit : FiTrash}
      submitButtonVariant={type === "delete" ? "danger" : "primary"}
      isFullWidth={true}
    >
      {type === "delete" ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <FiTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Delete {isChildProduct ? "Variant" : "Product"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              "{name}{isChildProduct ? ` (${data?.variantName})` : ""}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      ) : (
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  placeholder={isChildProduct ? "Enter variant name" : "Enter product name"}
                  autoFocus
                />
              </div>
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

              {
                type === 'update' && data?.isChildProduct && <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {data?.variantType}
                    </label>
                    <input
                      type="text"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      placeholder={isChildProduct ? "Enter variant name" : "Enter product name"}
                      autoFocus
                    />
                  </div> </ div>
              }
            </div>
            <div className="space-y-4">
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
                          <span
                            className={`block truncate text-gray-900 dark:text-gray-100 ${selectedCategory?.status === "inactive" &&
                              "text-red-1"
                              } `}
                          >
                            {selectedCategory?.name || "Select a category"}
                          </span>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronsUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                        {categories.map((category) => (
                          <Listbox.Option
                            key={category.id}
                            className={({ active }) =>
                              `relative cursor-default select-none ${category.status === "inactive" && "text-red-1"
                              } py-2 ${active
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-gray-100"
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
                                    className={`block truncate ${selected ? "font-medium" : "font-normal"
                                      }`}
                                  >
                                    {category.name}
                                  </span>
                                </div>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
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

          {/* Variants Section (Hidden for Child Products) */}
          {!isChildProduct && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={isVariants}
                  onChange={(e) => setIsVariants(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Variants
                </label>
              </div>
              {isVariants && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Variant Type
                      </label>
                      <input
                        type="text"
                        value={variantType}
                        onChange={(e) => setVariantType(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="e.g., Size, Color"
                      />
                    </div>
                    {type === 'update' || <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Use Different Images for Variants
                      </label>
                      <input
                        type="checkbox"
                        checked={isVariantsImage}
                        onChange={(e) => setIsVariantsImage(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Variants
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newVariantName}
                        onChange={(e) => setNewVariantName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Variant name (e.g., XL)"
                      />
                      {isVariantsImage && (
                        <button
                          onClick={() =>
                            setIsSelectImageDialog({
                              isOpen: true,
                              isSingle: true,
                              forVariant: true,
                            })
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <FiImage className="mr-2 h-4 w-4" />
                          Select
                        </button>
                      )}
                      <button
                        onClick={handleAddVariant}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {variantNameImages.map((variant, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          {variant.image && (
                            <Image
                              src={variant.image}
                              alt={variant.name}
                              height={40}
                              width={40}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                            {variant.name}
                          </span>
                          <button
                            onClick={() => handleRemoveVariant(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              className={`${images.length > 0
                  ? "bg-green-600"
                  : "bg-white dark:bg-gray-800"
                } p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Product Images
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload multiple product images
                  </p>
                </div>
                <button
                  onClick={() =>
                    setIsSelectImageDialog({
                      isOpen: true,
                      isSingle: false,
                      forVariant: false,
                    })
                  }
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  Select Images
                </button>
              </div>
            </div>
            <div
              className={`${imageCover ? "bg-green-600" : "bg-white dark:bg-gray-800"
                } p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                {imageCover ? (
                  <Image
                    height={100}
                    width={100}
                    className="h-16 w-16"
                    alt="coverimage"
                    src={imageCover}
                  />
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Cover Image
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Main product display image
                    </p>
                  </div>
                )}
                <button
                  onClick={() =>
                    setIsSelectImageDialog({
                      isOpen: true,
                      isSingle: true,
                      forVariant: false,
                    })
                  }
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FiImage className="mr-2 h-4 w-4" />
                  Select Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ImageSelectDialog
        isSingle={isSelectImageDialog.isSingle}
        isOpen={isSelectImageDialog.isOpen}
        onClose={() =>
          setIsSelectImageDialog({ isOpen: false, isSingle: false, forVariant: false })
        }
        onSubmit={(selectedImages) => {
          if (isSelectImageDialog.forVariant) {
            setNewVariantImage(
              Array.isArray(selectedImages) ? selectedImages[0] : selectedImages
            );
          } else {
            isSelectImageDialog.isSingle
              ? setImageCover(
                Array.isArray(selectedImages) ? selectedImages[0] : selectedImages
              )
              : setImages(selectedImages);
          }
        }}
        alreadySelected={
          isSelectImageDialog.forVariant
            ? newVariantImage
            : isSelectImageDialog.isSingle
              ? imageCover
              : images
        }
      />
    </DialogContext>
  );
}

export default ProductAddUpdateDeleteProductDialog;