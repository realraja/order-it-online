"use client";
import { login } from '@/redux/slicer/admin';
import { CheckAuthAdmin } from '@/utils/AdminAction';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const CheckAdmin = () => {
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        // Check user authentication status
        const checkAdmin = async () => {
            const data  = await CheckAuthAdmin();
            if (data.success) {
                dispatch(login());
            }else{
                router.push('/admin/login');
            }
        };

        checkAdmin();
    }, [dispatch]);

    return null
}

export default CheckAdmin