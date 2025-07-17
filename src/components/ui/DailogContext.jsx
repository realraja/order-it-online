"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";

const DialogContext = ({
  Icon,
  title,
  showDialog,
  onSubmit,
  onClose,
  children,
  submitText = "Submit",
  isLoading = false,
  closeOnOutsideClick = true
}) => {
  const dialogRef = useRef(null);

  const handleClose = () => onClose();

  const handleSubmit = () => {
    onSubmit();
    // setShowDialog(false);
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
              className="w-full max-w-md bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-auto scrollEditclass max-h-full"
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
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {title && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      {Icon && (
                        <span className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                          <Icon size={18} />
                        </span>
                      )}
                      {title}
                    </h2>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mb-6">
                  {children}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg transition-colors flex items-center justify-center min-w-[100px]"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      submitText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DialogContext;