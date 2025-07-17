// // components/admin/Sidebar.js
// import { Fragment } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { 
//   LayoutDashboard, 
//   Users, 
//   ShoppingCart, 
//   Package, 
//   Tag, 
//   Star, 
//   BarChart2, 
//   Settings 
// } from 'lucide-react';
// import { Dialog, Transition } from '@headlessui/react';
// import { useTheme } from './ThemeContext';

// const navItems = [
//   { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
//   { name: 'Users', href: '/admin/users', icon: Users },
//   { name: 'Products', href: '/admin/products', icon: Package },
//   { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
//   { name: 'Categories', href: '/admin/categories', icon: Tag },
//   { name: 'Reviews', href: '/admin/reviews', icon: Star },
//   { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
//   { name: 'Settings', href: '/admin/settings', icon: Settings },
// ];

// export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const router = useRouter();
//   const { theme } = useTheme();

//   return (
//     <>
//       {/* Mobile sidebar */}
//       <Transition.Root show={sidebarOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
//           <Transition.Child
//             as={Fragment}
//             enter="transition-opacity ease-linear duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="transition-opacity ease-linear duration-300"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
//           </Transition.Child>

//           <div className="fixed inset-0 z-40 flex">
//             <Transition.Child
//               as={Fragment}
//               enter="transition ease-in-out duration-300 transform"
//               enterFrom="-translate-x-full"
//               enterTo="translate-x-0"
//               leave="transition ease-in-out duration-300 transform"
//               leaveFrom="translate-x-0"
//               leaveTo="-translate-x-full"
//             >
//               <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
//                 <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
//                   <div className="flex flex-shrink-0 items-center px-4">
//                     <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
//                   </div>
//                   <nav className="mt-5 space-y-1 px-2">
//                     {navItems.map((item) => (
//                       <Link
//                         key={item.name}
//                         href={item.href}
//                         className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
//                           router.pathname === item.href
//                             ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
//                             : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
//                         }`}
//                       >
//                         <item.icon
//                           className={`mr-3 h-5 w-5 flex-shrink-0 ${
//                             router.pathname === item.href
//                               ? 'text-gray-500 dark:text-gray-300'
//                               : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
//                           }`}
//                           aria-hidden="true"
//                         />
//                         {item.name}
//                       </Link>
//                     ))}
//                   </nav>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//             <div className="w-14 flex-shrink-0" aria-hidden="true">
//               {/* Force sidebar to shrink to fit close icon */}
//             </div>
//           </div>
//         </Dialog>
//       </Transition.Root>

//       {/* Desktop sidebar */}
//       <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
//         <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
//           <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//             <div className="flex flex-shrink-0 items-center px-4">
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
//             </div>
//             <nav className="mt-5 flex-1 space-y-1 px-2">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
//                     router.pathname === item.href
//                       ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
//                   }`}
//                 >
//                   <item.icon
//                     className={`mr-3 h-5 w-5 flex-shrink-0 ${
//                       router.pathname === item.href
//                         ? 'text-gray-500 dark:text-gray-300'
//                         : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
//                     }`}
//                     aria-hidden="true"
//                   />
//                   {item.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }