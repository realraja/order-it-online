// // components/admin/Layout.js
// import { useState } from 'react';
// import { useTheme } from './ThemeContext';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';
// import { Menu } from 'lucide-react';

// export default function Layout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { theme } = useTheme();

//   return (
//     <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
//       {/* Content area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Topbar */}
//         <Topbar setSidebarOpen={setSidebarOpen} />
        
//         {/* Main content */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }