"use client";
import ThemeToggle from "@/components/ui/ThemeContext";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiUser, FiSettings, FiLogOut, FiHeart } from "react-icons/fi";
import LoginDialog from "../user/dialog/LoginDialog";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoginDialog } from "@/redux/slicer/auth";
import { useLazyGetUserAllProductBySearchQuery } from "@/redux/api/user";
import { useRouter } from "next/navigation";
import LogoutDialog from "./dialog/LogoutDialog";
import { motion } from 'framer-motion'

const Navbar = () => {

  const { userData, isUser, isLoginDialog, cart } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // console.log(userData);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountRef = useRef(null);
  const accountMenuRef = useRef(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);





  // Handle click outside to close search and account menu
  useEffect(() => {
    const handleClickOutside = (event) => {

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

        <div className="w-full ml-6">
          <div className="max-sm:block sm:hidden">
            <SearchItemComponent />
          </div>
          <div className="flex justify-end items-center ml-2 max-sm:hidden">
            {/* Search Component */}
            <div className="max-sm:hidden w-full mx-4">
              <SearchItemComponent />
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden max-sm:block"
              >
                <FiSearch className="text-gray-700 dark:text-gray-300" />
              </button>
              <ThemeToggle />

              {/* Account icon with hoverable menu */}
              <div className="relative">
                <div
                  ref={accountRef}
                  onMouseEnter={() => { isUser && setIsAccountMenuOpen(true) }}
                  onClick={() => { !isUser && dispatch(setIsLoginDialog(true)) }}
                >
                  <button className="p-2  cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FiUser className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <DropdownMenu image={userData.imgUrl} name={userData.name} accountMenuRef={accountMenuRef} setIsAccountMenuOpen={setIsAccountMenuOpen} isAccountMenuOpen={isAccountMenuOpen} />

              </div>

              {/* Cart */}
              <Link href={'/cart'} className="p-2  cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <FiShoppingCart className="text-gray-700 dark:text-gray-300" />
                {hasMounted && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {
        isLoginDialog && !isUser && <LoginDialog show={isLoginDialog} onClose={() => dispatch(setIsLoginDialog(false))} />
      }
    </nav>
  );
};

export default Navbar;


const SearchItemComponent = () => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [triggerSearch, { data: searchResponse, isFetching, error }] = useLazyGetUserAllProductBySearchQuery();
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim()) {
        triggerSearch(searchText);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchText, triggerSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setShowResults(false);
      router.push(`/products/${searchText}`);
    }
  };

  const products = searchResponse?.data || [];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchText}
          onClick={(e) => e.target.select()}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => searchText.trim() && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search for products..."
          className="w-full pl-5 pr-12 py-3 rounded-xl text-black dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent shadow-sm dark:bg-gray-800  transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400" />
        </button>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-96 overflow-y-auto"
        >
          {isFetching ? (
            <div className="p-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 dark:text-red-400">
              <FiAlertCircle className="inline mr-2" />
              Error loading results
            </div>
          ) : products.length > 0 ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((product) => (
                <motion.li
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    className="block p-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        {product.imageCover && (
                          <Image
                            fill
                            src={product.imageCover}
                            alt={product.name}
                            className="object-cover"
                            sizes="50px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ${product.discountPrice || product.price}
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                              ${product.price}
                            </span>
                          )}
                          {product.discountPrice && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded-full">
                              {Math.round(((product.price - product.discountPrice) / product.price * 100))}% off
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {product.category?.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          ) : searchText.trim() ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <FiSearch className="w-6 h-6 mb-2 opacity-60" />
              <p>No products found for "{searchText}"</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};



const DropdownMenu = ({ accountMenuRef, setIsAccountMenuOpen, image, name, isAccountMenuOpen }) => {
  const [isLogoutDialog, setIsLogoutDialog] = useState(false);


  return (
    <>
      <div
        ref={accountMenuRef}
        className={`${!isAccountMenuOpen && 'hidden'} absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-100 dark:border-gray-700`}
        onMouseEnter={() => setIsAccountMenuOpen(true)}
        onMouseLeave={() => setIsAccountMenuOpen(false)}
      >
        <div className="py-1">
          {/* User info section */}
          <div className="flex gap-3 items-center px-2">
            <img src={image} className="size-8 rounded-full" alt="userImage" />

            <div className=" py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{name}</p>
            </div>
          </div>

          {/* Menu items with icons */}
          <Link href={'/profile'} className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <FiUser className="w-5 h-5 mr-3 text-gray-400" />
            Profile
          </Link>

          <Link href={'/wishlist'} className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <FiHeart className="w-5 h-5 mr-3 text-gray-400" />
            Wishlist
          </Link>

          <Link href={'/orders'} className="flex items-center cursor-pointer w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <ListOrdered className="w-5 h-5 mr-3 text-gray-400" />
            Orders
          </Link>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          <button onClick={() => setIsLogoutDialog(true)} className="flex cursor-pointer items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <FiLogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>

      </div>
      {
        isLogoutDialog && <LogoutDialog isShow={isLogoutDialog} setIsShow={setIsLogoutDialog} />
      }
    </>
  )
} 