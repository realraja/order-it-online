'use client'
import AdminDashbordLoading from '@/app/admin/loading'
import { AdminSidebar, SaveLocalStorage } from '@/utils/localStorage'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function AuthLoading({children}) {
    const {isLoading,isSidebarOpen} = useSelector(state => state.admin)

 useEffect(() => {
  SaveLocalStorage({key:AdminSidebar,value:isSidebarOpen})
 }, [isSidebarOpen])

    if (isLoading) return <AdminDashbordLoading />




  return (
    <>
      {children}
    </>
  )
}

export default AuthLoading
