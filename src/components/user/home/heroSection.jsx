"use client"; // Add this directive at the top

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "anticipate",
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          className="md:flex md:items-center md:justify-between"
          initial={isMounted ? "hidden" : false}
          animate={isMounted ? "visible" : false}
          variants={containerVariants}
        >
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Discover Everything{" "}
              <span className="text-yellow-300">You Need</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-100 max-w-lg"
              variants={itemVariants}
            >
              The one-stop shop for all your needs. From electronics to
              fashion, home goods and more.
            </motion.p>
            
            <motion.button
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300 relative overflow-hidden group"
              variants={buttonVariants}
              whileHover={isMounted ? "hover" : false}
              whileTap={isMounted ? "tap" : false}
            >
              <span className="relative z-10">Shop Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            
            <motion.div 
              className="mt-12 flex space-x-4"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">Free Shipping</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="md:w-1/2 flex justify-center"
            variants={imageVariants}
            whileHover={isMounted ? "hover" : false}
          >
            <div className="relative">
              <img
                src="/static/logo.png"
                alt="Hero"
                className="rounded-lg shadow-2xl border-4 border-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -inset-4 bg-purple-400/20 rounded-lg blur-lg -z-10 animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated background elements - only render on client */}
      {isMounted && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;