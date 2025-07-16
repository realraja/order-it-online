'use client'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { GoogleLoginUser } from '@/utils/UserActions';
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slicer/auth';

export default function GoogleSignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);

            const {data} = await GoogleLoginUser({ googleToken: credentialResponse.credential });

            if(data){
                await dispatch(login(data));
            }

        } catch (error) {
            console.log('Login error:', error);
            alert('Login failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        console.log('Login Failed');
        toast.error('Google login failed. Please try again.');
    };




    return (
        <div className='w-full bg-transparent'>
             <div className="w-full flex items-center justify-center">
                {isLoading? <BeatLoader speedMultiplier={1.5} color='#671BB8' size={20} />:<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
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
                </GoogleOAuthProvider>}
            </div> 


        </div>
    );
}