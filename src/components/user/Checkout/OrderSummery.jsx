import React, { useEffect, useState } from 'react'
import { FiMapPin, FiCreditCard, FiArrowRight, FiChevronDown } from 'react-icons/fi'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import AddUpdateDeleteAddressDialog from '../Address/AddUpdateDeleteAddressDialog'
import SelectAddressDialog from '../Address/SelectAddressDialog'
import { FcMoneyTransfer } from 'react-icons/fc'
import { useAsyncMutation } from '@/hook/mutationHook'
import { usePlaceOrderMutation } from '@/redux/api/user'
import axios from 'axios'
import { toast } from 'react-toastify'
import { clearCart } from '@/redux/slicer/auth'

function OrderSummary({ subtotal }) {
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [selectAddressDialog, setSelectAddressDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('upi')
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)

    const [addAddressDialog, setAddAddressDialog] = useState(false);

    const shipping = subtotal > 10000 ? 0 : 500 // Free shipping over $100

    const { addresses, cart } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [PlaceOrder] = useAsyncMutation(usePlaceOrderMutation);
    // console.log(addresses)

    const items = cart.map(p => ({ product: p.product, quantity: p.quantity }));

    // console.log(items)

    useEffect(() => {
        if (addresses) {
            setSelectedAddress(addresses?.find(a => a.isDefault) || null)
        }
    }, [])

    // console.log(selectedAddress)

    const handleCheckout = async () => {

        try {
            if (selectedPayment === 'cod') {
            await PlaceOrder({
                items,
                shippingAddress: selectedAddress,
                paymentMethod: selectedPayment,
                totalAmount: subtotal + shipping,
                // paymentDetails = {},
                // coupon,
            }, 'Placing Order...');

            dispatch(clearCart())
        } else {
            const { data } = await axios.post('/api/user/order/payment', { amount: (subtotal + shipping) * 100 });
            // console.log(data.data)

            const paymentData = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                order_id: data.data.id,

                handler: async function (response) {
                    // console.log(response)
                    const { data } = await axios.post('/api/user/order/verify-payment',{
                    orderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });
                // console.log(data)
                    toast.success(data.message,{position:'bottom-right'});
                    await PlaceOrder({
                        items,
                        shippingAddress: selectedAddress,
                        paymentMethod: selectedPayment,
                        totalAmount: subtotal + shipping,
                        // paymentDetails = {},
                        // coupon,
                    }, 'Placing Order...');
                    dispatch(clearCart());
                },
            };

            const payment = new (window).Razorpay(paymentData);
            payment.open();
        }
        } catch (error) {
            console.log(error)
        }
        

    }



    const paymentMethods = [
        { id: 'upi', name: 'Online', icon: <FiCreditCard /> },
        { id: 'cod', name: 'Cash On Delevery', icon: <FcMoneyTransfer /> }
    ]

    return (<>
        <div className="space-y-6">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-black dark:text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="font-medium text-black dark:text-white">
                            {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                        </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="font-bold text-green-600">₹{(subtotal + shipping).toLocaleString()}</span>
                    </div>
                </div>

                {/* Address Selection */}
                <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiMapPin /> Delivery Address
                    </h3>

                    {selectedAddress && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm space-y-1">
                            <div className="font-medium text-gray-900 dark:text-white">{selectedAddress.name}</div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {selectedAddress.landmark}, {selectedAddress.city}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {selectedAddress.state}, {selectedAddress.country} - {selectedAddress.zipCode}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Phone: {selectedAddress.phone}
                            </div>
                            {selectedAddress.isDefault && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Default Address
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className='w-full items-center flex flex-col justify-center'>

                        <button
                            onClick={() => addresses.length > 0 ? setSelectAddressDialog(true) : setAddAddressDialog(true)}
                            className={`mt-3 cursor-pointer ${addresses.length > 0 ? 'text-green-500' : 'bg-green-1'} py-1 px-2  rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg`}
                        >
                            {addresses.length > 0 ? !selectedAddress ? 'Select Address' : 'Change Address' : 'Add Address'}
                        </button>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiCreditCard /> Payment Method
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                            className="w-full flex justify-between items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="flex items-center text-black dark:text-white gap-2">
                                {paymentMethods.find(p => p.id === selectedPayment).icon}
                                {paymentMethods.find(p => p.id === selectedPayment).name}
                            </span>
                            <FiChevronDown className={`transition-transform ${showPaymentDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showPaymentDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.id}
                                        onClick={() => {
                                            setSelectedPayment(method.id)
                                            setShowPaymentDropdown(false)
                                        }}
                                        className={`flex items-center gap-3 p-3 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${selectedPayment === method.id ? 'bg-green-50 dark:bg-green-900/30' : ''}`}
                                    >
                                        {method.icon}
                                        <span>{method.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={!selectedAddress}
                    className={`w-full mt-6 py-3 bg-green-1 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${!selectedAddress ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-700'}`}
                >
                    Proceed to Checkout
                    <FiArrowRight />
                </button>

                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>or <Link href="/products" className="text-green-500 hover:underline">Continue Shopping</Link></p>
                </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                <p>Free shipping on orders over ₹10,000</p>
                <p className="mt-1">Estimated delivery: 2-5 business days</p>
            </div>
        </div>

        {
            addAddressDialog && <AddUpdateDeleteAddressDialog isOpen={addAddressDialog} onClose={() => setAddAddressDialog(false)} type='add' />
        }
        {
            selectAddressDialog && <SelectAddressDialog isOpen={selectAddressDialog} onClose={() => setSelectAddressDialog(false)} onSubmit={(a) => setSelectedAddress(a)} />
        }
    </>
    )
}

export default OrderSummary


