"use client";
import { login } from '@/redux/slicer/auth';
import { CheckAuthUser } from '@/utils/UserActions';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const CheckUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Check user authentication status
        const checkUser = async () => {
            const data  = await CheckAuthUser();
            if (data.success) {
                // console.log(data)
                dispatch(login(data.data.user));
            }
        };

        checkUser();
    }, [dispatch]);

    return null
}

export default CheckUser