"use client";

import { SendNotificationToAdmin } from "@/utils/UserActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [contactForm, setContactForm] = useState({
    title: "",
    email: "",
    message: ""
  });

  const { isUser, userData } = useSelector(state => state.auth);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}`);
    setEmail("");
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true)
    await SendNotificationToAdmin({ title: contactForm.title, message: contactForm.message, email: isUser ? contactForm.email : userData.email, user: isUser ? userData._id : null })
    setContactForm({ title: "", email: "", message: "" });
    setIsLoadingSubmit(false);

  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex max-sm:flex-col gap-10 mb-12">
          {/* Company Info */}
          <motion.div
            custom={0}
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              ShopEverything
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your one-stop shop for all your needs. Quality products at affordable prices.
            </p>
            <Image height={350} width={350} alt="logo" src="/static/logo.png" />
          </motion.div>



          {/* Contact Information */}
          <motion.div
            custom={2}
            variants={itemVariants}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">123 Shop Street, Retail City, RC 12345</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-indigo-600 dark:text-indigo-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FiMail className="text-indigo-600 dark:text-indigo-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">support@shopeverything.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter & Contact Form */}
          <motion.div
            custom={3}
            variants={itemVariants}
            className="space-y-6"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Newsletter</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Subscribe to get updates on new products and deals.
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="px-4 py-3 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-r-lg text-white flex items-center justify-center"
                >
                  <FiSend className="mr-2" />
                </motion.button>
              </form>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Have a Question?</h4>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                {!isUser && <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />}
                <input
                  type="text"
                  value={contactForm.title}
                  onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                  placeholder="Your title"
                  required
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />

                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Your Message"
                  required
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                ></textarea>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  {isLoadingSubmit? <PulseLoader  />:'Submit'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ShopEverything. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            {["Terms", "Privacy", "Cookies"].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;