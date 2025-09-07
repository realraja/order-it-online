'use client'
import AdminDashbordLoading from '@/app/admin/loading'
import { setIsSidebarOpen } from '@/redux/slicer/admin'
import { AdminSidebar, GetLocalStorage, SaveLocalStorage } from '@/utils/localStorage'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function AuthLoading({ children }) {
  const { isLoading, isSidebarOpen } = useSelector(state => state.admin)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsSidebarOpen(GetLocalStorage({ key: AdminSidebar })))
  }, [])

  useEffect(() => {
    SaveLocalStorage({ key: AdminSidebar, value: isSidebarOpen })
  }, [isSidebarOpen])

  if (isLoading) return <AdminDashbordLoading />




  return (
    <>
      {children}
    </>
  )
}

export default AuthLoading
