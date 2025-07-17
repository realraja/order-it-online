import CheckAdmin from '@/components/admin/CheckAdmin'
import React from 'react'

export default function Layout({children}) {
  return (
    <>
    <CheckAdmin />
      {children}
    </>
  )
}

