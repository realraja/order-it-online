'use client'
import DialogContext from '@/components/ui/DailogContext'
import { logout } from '@/redux/slicer/auth';
import { logoutUser } from '@/utils/UserActions';
import React, { useState } from 'react'
import { FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

function LogoutDialog({ isShow, setIsShow }) {
    const [isLogOutLoading, setIsLogOutLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        setIsLogOutLoading(true);
        await logoutUser();
        await dispatch(logout());
        setIsLogOutLoading(false);
        setIsShow(false);
    }
    return (
        <DialogContext showDialog={isShow} onClose={() => setIsShow(false)} title="Logout" submitText="LogOut" onSubmit={handleLogout} isLoading={isLogOutLoading} Icon={FiLogOut}  >

            <p className="">Are you sure you want to logout?</p>

        </DialogContext>
    )
}

export default LogoutDialog
