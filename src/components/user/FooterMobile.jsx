"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Grid2x2Check, Heart, HomeIcon, Search, ShoppingCart, UserIcon, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const siteNavigationArr = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Categories", href: "/categories", icon: Grid2x2Check },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Profile", href: "/profile", icon: UserIcon },
];

const FooterMobile = () => {
    const pathname = usePathname();
    const middleIndex = Math.floor(siteNavigationArr.length / 2);
    const { cart } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 sm:hidden shadow-lg"
        >
            <div className="relative flex justify-between items-center px-3 h-16">
                {siteNavigationArr.map((item, index) => {
                    const isActive = pathname === item.href;
                    const isMiddle = index === middleIndex;
                    const Icon = item.icon;
                    const isCart = item.name === "Cart";

                    if (isMiddle) {
                        return (
                            <motion.div
                                key={index}
                                className="relative z-20 -mt-8 w-16 h-16 flex flex-col items-center"
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link href={item.href} className="flex flex-col items-center">
                                    <motion.div
                                        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg relative ${isActive
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        animate={{
                                            y: isActive ? [-5, 0] : 0,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                    >
                                        {isActive ? (
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: 135 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </motion.div>
                                        ) : (
                                            <>
                                                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                                {!isLoading && isCart && cart?.length > 0 && (
                                                    <motion.span
                                                        className="absolute top-0 right-0 bg-green-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring" }}
                                                    >
                                                        {cart.length}
                                                    </motion.span>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </Link>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            className="absolute -bottom-1 left-0 right-0 flex justify-center"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                        >
                                            <div className="h-1 w-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.p
                                    className={`text-xs mt-1 text-center ${isActive
                                            ? "text-indigo-600 dark:text-indigo-400 font-medium"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                    animate={{
                                        opacity: isActive ? 1 : 0.8,
                                    }}
                                >
                                    {item.name}
                                </motion.p>
                            </motion.div>
                        );
                    }

                    return (
                        <Link key={index} href={item.href} className="w-full text-center">
                            <motion.div
                                className={`flex flex-col items-center ${isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.div
                                    className="relative p-1"
                                    whileHover={{ scale: 1.1 }}
                                    animate={{
                                        y: isActive ? -3 : 0,
                                    }}
                                >
                                    <Icon className="w-5 h-5" />
                                    {isCart && cart?.length > 0 && !isActive && (
                                        <motion.span
                                            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring" }}
                                        >
                                            {cart.length}
                                        </motion.span>
                                    )}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.span
                                                className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <motion.p
                                    className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}
                                    animate={{
                                        opacity: isActive ? 1 : 0.8,
                                    }}
                                >
                                    {item.name}
                                </motion.p>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Floating indicator for middle button */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-white dark:bg-gray-900 rounded-t-full z-10"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.2 }}
            />

            {/* Gradient border effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 dark:opacity-30" />
        </motion.div>
    );
};

export default FooterMobile;



