"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {  useRef, useEffect } from "react";

const DialogContextSimple = ({
  showDialog,
  onClose,
  children,
  closeOnOutsideClick = true,
  isFullWidth = false
}) => {
  const dialogRef = useRef(null);

  const handleClose = () => {
    onClose();
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeOnOutsideClick && 
          dialogRef.current && 
          !dialogRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnOutsideClick]);

  return (
    <AnimatePresence>
      {showDialog && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog - Fixed centering */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
            <motion.div
              ref={dialogRef}
              className={`w-full ${!isFullWidth && 'max-w-md'}  bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-auto scrollEditclass max-h-full`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30 
                } 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="p-0">
                <div className="flex items-center justify-end">
                  <button 
                    onClick={handleClose} 
                    className="absolute z-10 p-1.5 -mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div >
                  {children}
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DialogContextSimple;