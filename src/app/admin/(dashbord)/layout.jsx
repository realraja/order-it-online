// components/admin/Layout.js
// 'use client';
// import { useState } from 'react';
import AuthLoading from '@/components/admin/AuthLoading';
import Sidebar from '@/components/admin/SideBarComponent';
import Topbar from '@/components/admin/TopBarComponent';

export default function Layout({ children }) {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    //   const { theme } = useTheme();

    return (
        <div className={`relative `}>
            <Topbar />

            {/* Content area */}
            <div className="flex ">
                <Sidebar />

                {/* Main content */}

                <main className="flex-1 bg-light-1 dark:bg-dark-1 w-full h-screen overflow-y-auto pt-20 pb-6 px-2 scrollEditclass">
                    <AuthLoading>
                        {children}
                    </AuthLoading>
                </main>
            </div>
        </div>
    );
}