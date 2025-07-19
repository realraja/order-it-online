import DialogContext from '@/components/ui/DailogContext'
import { useAddAddressMutation, useDeleteAddressMutation, useUpdateAddressMutation } from '@/redux/api/user'
import { setAddresses } from '@/redux/slicer/auth'
import React, { useState, useEffect } from 'react'
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

function AddUpdateDeleteAddressDialog({ type = 'add', data, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        landmark: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        isDefault: true
    })
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setFormData({
                name: data?.name || '',
                phone: data?.phone || '',
                landmark: data?.landmark || '',
                city: data?.city || '',
                state: data?.state || '',
                country: data?.country || 'India',
                zipCode: data?.zipCode || '',
                isDefault: data?.isDefault || false
            })
        }
    }, [data])

    const [addAddress] = useAddAddressMutation()
    const [updateAddress] = useUpdateAddressMutation()
    const [deleteAddress] = useDeleteAddressMutation()

    const handleSubmit = async () => {
        setIsLoading(true);
        if (type === 'add') {
            const data = await addAddress(formData);
            toast.success(data?.data?.message,{autoClose:2000})
            console.log(data)
            dispatch(setAddresses(data?.data?.data))
        } else if (type === 'update') {
            const dataUpdated = await updateAddress({ id: data?._id, ...formData })
            toast.success(dataUpdated?.data?.message,{autoClose:2000})
            dispatch(setAddresses(dataUpdated?.data?.data))
        } else if (type === 'delete') {
            const dataDelete = await deleteAddress({ id: data?._id })
            toast.success(dataDelete?.data?.message,{autoClose:2000})
            dispatch(setAddresses(dataDelete.data.data))
        }
        setIsLoading(false);
        onClose()
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const actionText = type.charAt(0).toUpperCase() + type.slice(1)

    return (
        <DialogContext
            showDialog={isOpen}
            onClose={() => onClose(false)}
            onSubmit={handleSubmit}
            submitText={`${actionText} Address`}
            title={`${actionText} Address`}
            Icon={type === 'add' ? FiPlus : type === 'update' ? FiEdit : FiTrash}
            isLoading={isLoading}
        >
            {type === 'delete' ? (
                <div className="p-4 text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        Are you sure you want to delete this address?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Address for "{formData.name}" will be permanently removed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Landmark
                            </label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Nearby landmark"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter city"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter state"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Zip Code *
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter zip code"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter country"
                                disabled
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Set as default address
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext>
    )
}

export default AddUpdateDeleteAddressDialog