"use client"
import { Fragment, useEffect, useState } from 'react';
import { Menu as LucideMenu, Bell, ChevronDown } from 'lucide-react';
// import { Menu, Transition } from '@headlessui/react';
import ThemeToggle from '../ui/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setIsSidebarOpen } from '@/redux/slicer/admin';
import { FiLogOut } from 'react-icons/fi';
import { logoutAdmin } from '@/utils/AdminAction';
import DialogContext from '../ui/DailogContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// import { useTheme } from './ThemeContext';

export default function Topbar() {
    // const { theme, toggleTheme } = useTheme();
    // const [notifications, setNotifications] = useState([
    //     { id: 1, message: 'New order received', time: '5 mins ago', read: false },
    //     { id: 2, message: 'New user registered', time: '1 hour ago', read: false },
    // ]);
    const [isLogoutDialog, setIsLogoutDialog] = useState(false);
    const [isLogOutLoading, setIsLogOutLoading] = useState(false);

    // console.log('running')

    const { isSidebarOpen, isAdmin,isLoading } = useSelector(state => state.admin)
    const dispatch = useDispatch();
    const router = useRouter(); 

    useEffect(() => {
        if (!isAdmin && !isLoading) router.push('/admin/login');
    }, [isAdmin]);

    const handleLogout = async () => {
        setIsLogOutLoading(true);
        await logoutAdmin();
        await dispatch(logout());
        setIsLogOutLoading(false);
        setIsLogoutDialog(false);
    }

    // console.log(isSidebarOpen)

    return (
        <div className="fixed top-0 z-50 flex h-16 flex-shrink-0 w-full bg-white shadow dark:bg-gray-800 dark:shadow-gray-700">
            
            <div className="flex flex-1 justify-between px-4">
                <button
                type="button"
                className="cursor-pointer border-gray-200 px-4 text-gray-500"
                onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
            >
                <span className="sr-only">Open sidebar</span>
                <LucideMenu className="h-6 w-6" aria-hidden="true" />
            </button>
                <Link href={'/admin'} className='flex justify-center items-center'>

                    <Image src={'/static/logo.png'} height={500} width={500} alt='logo' className='w-16 h-16' />
                    <span className='text-red-1 text-xl'>Order It Online</span>
                </Link>
                <div className="ml-4 flex items-center gap-4 md:ml-6">
                    {/* Theme toggle */}
                    <ThemeToggle />

                    {/* Notifications dropdown */}
                    {/* <Menu as="div" className="relative ml-3">
                        <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800">
                                <span className="sr-only">Open notifications</span>
                                <div className="relative">
                                    <Bell className="h-6 w-6 cursor-pointer text-gray-400 dark:text-gray-300" />
                                    {notifications.some((n) => !n.read) && (
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800" />
                                    )}
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                                <div className="block px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 dark:text-gray-200 dark:border-gray-600">
                                    Notifications
                                </div>
                                {notifications.map((notification) => (
                                    <Menu.Item key={notification.id}>
                                        {({ active }) => (
                                            <div
                                                className={`px-4 py-2 text-sm cursor-default ${active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                    } ${!notification.read ? 'font-semibold' : ''}`}
                                            >
                                                <p className="text-gray-700 dark:text-gray-200">{notification.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-300">{notification.time}</p>
                                            </div>
                                        )}
                                    </Menu.Item>
                                ))}
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            className={`block px-4 py-2 text-sm text-center text-indigo-600 dark:text-indigo-400 ${active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                }`}
                                        >
                                            View all
                                        </div>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu> */}

                    {/* Profile dropdown */}
                    <button onClick={() => setIsLogoutDialog(true)} className='text-red-1 mx-4 cursor-pointer'><FiLogOut className="size-6" /></button>
                </div>
            </div>
            {
                isLogoutDialog && <DialogContext showDialog={isLogoutDialog} onClose={() => setIsLogoutDialog(false)} title="Logout" submitText="LogOut" onSubmit={handleLogout} isLoading={isLogOutLoading} Icon={FiLogOut}  >

                    <p className="">Are you sure you want to logout?</p>

                </DialogContext>
            }
        </div>
    );
}
