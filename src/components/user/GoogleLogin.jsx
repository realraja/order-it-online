'use client'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
// import { useRouter } from 'next/navigation';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { useDispatch } from 'react-redux';

export default function GoogleSignIn() {
    // const router = useRouter();
    const [dob, setDob] = useState('');
    const [showDobModal, setShowDobModal] = useState(false);
    // const [googleData, setGoogleData] = useState({});

    // const dispatch = useDispatch();

    const handleSuccess = async (credentialResponse) => {
        try {
            // Decode the JWT token to get user info
            const decoded = jwtDecode(credentialResponse.credential);

            console.log(decoded, credentialResponse)

            // Send the credential to your backend

            // setButtonLoading(true);
            // const data = await GoogleLoginUser({ googleToken: credentialResponse.credential });
            // // console.log(data);
            // if (data.success) {
            //     toast.success(data.message);

            //     await dispatch(login(data?.data));
            //     router.push('/')
            // } else {
            //     // console.log(data);
            //     if (data?.data?.goToRegistration) {
            //         setGoogleData(decoded)
            //         setShowDobModal(true);
            //     } else {
            //         toast.error(data.message);
            //     }
            // }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    };

    const handleError = () => {
        console.log('Login Failed');
        alert('Google login failed. Please try again.');
    };


    const handleDobSubmit = async (e) => {
        e.preventDefault();
        console.log('hadleDobSubmit');
        // console.log(googleData, dob);

        // const password = googleData?.email.split('@')[0] + dob.split('-')[0];

        // const data = await RegisterUser({ image: googleData?.picture, name: googleData?.name, email: googleData?.email, password, dob: dob });
        // console.log(data);
        // if (data.success) {
        //     toast.success(data.message);

        //     await dispatch(login(data?.data));
        //     router.push('/')
        // } else {
        //     toast.error(data.message);
        // }
    };

    return (
        <div className='w-full bg-transparent'>
            {/* Google OAuth Provider */}
            <div className="w-full flex items-center justify-center">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                        auto_select
                        theme="filled_blue"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                    />
                </GoogleOAuthProvider>
            </div>

            {/* DOB Input Modal using Headless UI Dialog and Framer Motion for animation */}
            {showDobModal && (
                <Transition appear show={showDobModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setShowDobModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-transparent bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6"
                                        >
                                            Enter Your Date of Birth
                                        </Dialog.Title>

                                        <form onSubmit={handleDobSubmit} className="mt-4 space-y-4">
                                            <input
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                required
                                            />
                                            <div className="flex space-x-4">

                                                <button
                                                    type="button"
                                                    onClick={() => setShowDobModal(false)}
                                                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 bg-purple-500 text-white py-2 rounded hover:bg-blue-600 transition"
                                                >
                                                    Submit DOB
                                                </button>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </div>
    );
}