"use client";
import { login } from '@/redux/slicer/auth';
import { CartStorageKey, SaveLocalStorage } from '@/utils/localStorage';
import { CheckAuthUser } from '@/utils/UserActions';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const CheckUser = () => {
    const dispatch = useDispatch();
    const {cart} = useSelector(state=> state.auth)

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


    useEffect(() => {    
        SaveLocalStorage({ key: CartStorageKey, value: cart }); 
    }, [cart])

    return null
}

export default CheckUser