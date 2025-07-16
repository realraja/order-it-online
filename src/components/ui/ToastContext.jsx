"use client";
import { useTheme } from 'next-themes';
import React from 'react'
import { ToastContainer } from 'react-toastify'

const ToastContext = () => {
    const { theme } = useTheme();
    return (
        <div>
            <ToastContainer
                theme={theme}
            />
        </div>
    )
}

export default ToastContext