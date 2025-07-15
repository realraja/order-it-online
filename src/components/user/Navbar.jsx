"use client";
import ThemeToggle from "@/components/ui/ThemeContext";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import LoginDialog from "../user/dialog/LoginDialog";

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoginDialog, setIsLoginDialog] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Focus the search input when isSearchActive becomes true
  useEffect(() => {
    if (isSearchActive && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchActive]);

  // Handle click outside to close search and account menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target) &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link href={'/'} className="flex-shrink-0 flex items-center">
          <Image src="/static/logo.png" alt="Logo" width={50} height={50} />
          <span className="text-2xl max-sm:hidden font-bold text-red-1">
            OrderItOnline
          </span>
        </Link>

        <div className="w-full ml-3">
          {isSearchActive ? (
            <div className="max-sm:block sm:hidden">
              <SearchItemComponent searchRef={searchRef} />
            </div>
          ) : (
            <div className="flex justify-end items-center ml-2">
              {/* Search Component */}
              <div className="max-sm:hidden w-full mx-4">
                <SearchItemComponent searchRef={searchRef} />
              </div>

              {/* Right side icons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSearchActive(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden max-sm:block"
                >
                  <FiSearch className="text-gray-700 dark:text-gray-300" />
                </button>
                <ThemeToggle />

                {/* Account icon with hoverable menu */}
                <div className="relative">
                  <div
                    ref={accountRef}
                    // onMouseEnter={() => setIsAccountMenuOpen(true)}
                    onClick={() => setIsLoginDialog(true)}
                  >
                    <button className="p-2  cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiUser className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  {isAccountMenuOpen && (
                    <DropdownMenu accountMenuRef={accountMenuRef} setIsAccountMenuOpen={setIsAccountMenuOpen} />
                  )}
                </div>

                {/* Cart */}
                <button className="p-2  cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                  <FiShoppingCart className="text-gray-700 dark:text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {
        isLoginDialog && <LoginDialog show={isLoginDialog} setShow={setIsLoginDialog} />
      }
    </nav>
  );
};

export default Navbar;

const SearchItemComponent = ({ searchRef }) => {
  return (
    <div className="relative">
      <input
        ref={searchRef}
        type="text"
        placeholder="Search for anything..."
        className="w-full mx pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-1 dark:bg-gray-800 dark:text-white"
      />
      <FiSearch className="absolute right-3 top-3 text-gray-400" />
    </div>
  );
};


const DropdownMenu = ({ accountMenuRef, setIsAccountMenuOpen }) => {

  return (
    <div
      ref={accountMenuRef}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-100 dark:border-gray-700"
      onMouseEnter={() => setIsAccountMenuOpen(true)}
      onMouseLeave={() => setIsAccountMenuOpen(false)}
    >
      <div className="py-1">
        {/* User info section */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
        </div>

        {/* Menu items with icons */}
        <button className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <FiUser className="w-5 h-5 mr-3 text-gray-400" />
          Account Settings
        </button>

        <button className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <FiSettings className="w-5 h-5 mr-3 text-gray-400" />
          Preferences
        </button>

        <button className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <ListOrdered className="w-5 h-5 mr-3 text-gray-400" />
          Orders
        </button>

        <div className="border-t border-gray-100 dark:border-gray-700"></div>

        <button className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <FiLogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
} 