"use client";
import ThemeToggle from "@/components/ui/ThemeContext";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiUser, FiSettings, FiLogOut, FiHeart } from "react-icons/fi";
import LoginDialog from "../user/dialog/LoginDialog";
import { useDispatch, useSelector } from "react-redux";
import DialogContext from "../ui/DailogContext";
import { logoutUser } from "@/utils/UserActions";
import { logout, setIsLoginDialog } from "@/redux/slicer/auth";
import { useLazyGetUserAllProductBySearchQuery } from "@/redux/api/user";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const { userData, isUser, isLoginDialog, cart } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // console.log(userData);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const accountMenuRef = useRef(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);



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
          )}
        </div>
      </div>

      {
        isLoginDialog && !isUser && <LoginDialog show={isLoginDialog} onClose={() => dispatch(setIsLoginDialog(false))} />
      }
    </nav>
  );
};

export default Navbar;


const SearchItemComponent = ({ searchRef }) => {
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
      router.push(`/products/${searchText}`);
      setShowResults(false);
    }
  };

  const handleProductClick = () => {
    setShowResults(false);
    setSearchText('');
  };

  // Extract products from response or default to empty array
  const products = searchResponse?.data || [];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          ref={searchRef}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => searchText.trim() && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search for anything..."
          className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
        />
        <button type="submit" className="absolute right-3 top-3">
          <FiSearch className="text-gray-400 hover:text-gray-600" />
        </button>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto scrollEditclass">
          {isFetching ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error loading results</div>
          ) : products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li
                  key={product._id}
                  className="p-3  hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  onClick={handleProductClick}
                >
                  <Link href={`/product/${product.slug || product._id}`} className="block">
                    <div className="flex items-center gap-3">
                      {product.imageCover && (
                        <Image
                          height={50}
                          width={50}
                          src={product.imageCover}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {product.name}
                        </div>
                        <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>${product.discountPrice || product.price}</span>
                          {product.discountPrice && (
                            <span className="line-through">${product.price}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category?.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : searchText.trim() ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};



const DropdownMenu = ({ accountMenuRef, setIsAccountMenuOpen, image, name, isAccountMenuOpen }) => {
  const [isLogoutDialog, setIsLogoutDialog] = useState(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsLogOutLoading(true);
    await logoutUser();
    await dispatch(logout());
    setIsLogOutLoading(false);
    setIsLogoutDialog(false);
  }
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
        isLogoutDialog && <DialogContext showDialog={isLogoutDialog} onClose={() => setIsLogoutDialog()} title="Logout" submitText="LogOut" onSubmit={handleLogout} isLoading={isLogOutLoading} Icon={FiLogOut}  >

          <p className="">Are you sure you want to logout?</p>

        </DialogContext>
      }
    </>
  )
} 