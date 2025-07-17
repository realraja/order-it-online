// // components/admin/Topbar.js
// import { useState } from 'react';
// import { Menu, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
// import { Menu, Transition } from '@headlessui/react';
// import { useTheme } from './ThemeContext';

// export default function Topbar({ setSidebarOpen }) {
//   const { theme, toggleTheme } = useTheme();
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: 'New order received', time: '5 mins ago', read: false },
//     { id: 2, message: 'New user registered', time: '1 hour ago', read: false },
//   ]);

//   return (
//     <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800 dark:shadow-gray-700">
//       <button
//         type="button"
//         className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden dark:border-gray-700"
//         onClick={() => setSidebarOpen(true)}
//       >
//         <span className="sr-only">Open sidebar</span>
//         <Menu className="h-6 w-6" aria-hidden="true" />
//       </button>
//       <div className="flex flex-1 justify-between px-4">
//         <div className="flex flex-1"></div>
//         <div className="ml-4 flex items-center md:ml-6">
//           {/* Theme toggle */}
//           <button
//             type="button"
//             className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-gray-200"
//             onClick={toggleTheme}
//           >
//             <span className="sr-only">Toggle theme</span>
//             {theme === 'dark' ? (
//               <Sun className="h-6 w-6" aria-hidden="true" />
//             ) : (
//               <Moon className="h-6 w-6" aria-hidden="true" />
//             )}
//           </button>

//           {/* Notifications dropdown */}
//           <Menu as="div" className="relative ml-3">
//             <div>
//               <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800">
//                 <span className="sr-only">Open notifications</span>
//                 <div className="relative">
//                   <Bell className="h-6 w-6 text-gray-400 dark:text-gray-300" />
//                   {notifications.some((n) => !n.read) && (
//                     <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800" />
//                   )}
//                 </div>
//               </Menu.Button>
//             </div>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
//                 <Menu.Item>
//                   <div className="block px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 dark:text-gray-200 dark:border-gray-600">
//                     Notifications
//                   </div>
//                 </Menu.Item>
//                 {notifications.map((notification) => (
//                   <Menu.Item key={notification.id}>
//                     {({ active }) => (
//                       <div
//                         className={`px-4 py-2 text-sm ${
//                           active ? 'bg-gray-100 dark:bg-gray-600' : ''
//                         } ${!notification.read ? 'font-semibold' : ''}`}
//                       >
//                         <p className="text-gray-700 dark:text-gray-200">{notification.message}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-300">
//                           {notification.time}
//                         </p>
//                       </div>
//                     )}
//                   </Menu.Item>
//                 ))}
//                 <Menu.Item>
//                   <div className="block px-4 py-2 text-sm text-center text-indigo-600 hover:bg-gray-100 dark:text-indigo-400 dark:hover:bg-gray-600">
//                     View all
//                   </div>
//                 </Menu.Item>
//               </Menu.Items>
//             </Transition>
//           </Menu>

//           {/* Profile dropdown */}
//           <Menu as="div" className="relative ml-3">
//             <div>
//               <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800">
//                 <span className="sr-only">Open user menu</span>
//                 <img
//                   className="h-8 w-8 rounded-full"
//                   src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                   alt=""
//                 />
//                 <ChevronDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-300" />
//               </Menu.Button>
//             </div>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <a
//                       href="#"
//                       className={`block px-4 py-2 text-sm ${
//                         active ? 'bg-gray-100 dark:bg-gray-600' : ''
//                       }`}
//                     >
//                       Your Profile
//                     </a>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <a
//                       href="#"
//                       className={`block px-4 py-2 text-sm ${
//                         active ? 'bg-gray-100 dark:bg-gray-600' : ''
//                       }`}
//                     >
//                       Settings
//                     </a>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <a
//                       href="#"
//                       className={`block px-4 py-2 text-sm ${
//                         active ? 'bg-gray-100 dark:bg-gray-600' : ''
//                       }`}
//                     >
//                       Sign out
//                     </a>
//                   )}
//                 </Menu.Item>
//               </Menu.Items>
//             </Transition>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   );
// }