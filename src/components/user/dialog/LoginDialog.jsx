'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FiMail, FiArrowRight, FiLoader } from 'react-icons/fi';
import { FcLock } from 'react-icons/fc';
import { SyncLoader } from 'react-spinners';
// import Link from 'next/link';
import DialogContextSimple from '@/components/ui/SimpleDialogContext';
import GoogleSignIn from '../GoogleLogin';
import { useRouter } from 'next/navigation';
import { LoginUser, SendResetPasswordLinkUser } from '@/utils/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slicer/auth';

const LoginDialog = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  const {cart}= useSelector(state => state.auth);

  const isValid = email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setButtonLoading(true);

      const loginCart = cart?.map(p => ({product:p.product._id,quantity:p.quantity})) || [];
      // console.log(loginCart)

      const { data } = await LoginUser({ email, password,cart:loginCart });
      if (data) {
        await dispatch(login(data));
        router.push('/');
        onClose() // Close the dialog on successful login
      }


    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleForgotPassword = async() => {
    setButtonLoading(true);
    await SendResetPasswordLinkUser({email});
    setButtonLoading(false);
    setShowForgotPassword(false);
    onClose()
  };

  return (
    <DialogContextSimple showDialog={show} onClose={()=> onClose()}>
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="dark:bg-gray-900/80 bg-white/90 backdrop-blur-sm border dark:border-gray-700 border-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-md dark:text-white text-gray-900 space-y-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute w-40 h-40 dark:bg-purple-600/20 bg-purple-400/20 rounded-full filter blur-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 dark:bg-indigo-600/20 bg-indigo-400/20 rounded-full filter blur-xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h2>

          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <motion.form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <motion.div className="flex items-center dark:bg-gray-800 bg-gray-100 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500">
                      <FiMail className="dark:text-gray-400 text-gray-500 mr-2" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent focus:outline-none dark:placeholder-gray-400 placeholder-gray-500"
                      />
                    </motion.div>
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 mt-1">
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <motion.div className="flex items-center dark:bg-gray-800 bg-gray-100 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500">
                      <FcLock className="mr-2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent focus:outline-none dark:placeholder-gray-400 placeholder-gray-500"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-700">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </motion.div>
                    {errors.password && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 mt-1">
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-purple-400 hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!isValid || buttonLoading}
                    whileHover={isValid && !buttonLoading ? { scale: 1.02 } : {}}
                    whileTap={isValid && !buttonLoading ? { scale: 0.98 } : {}}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isValid && !buttonLoading
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 text-white'
                        : 'dark:bg-gray-700 bg-gray-300 cursor-not-allowed dark:text-gray-400 text-gray-600'
                      }`}
                  >
                    {buttonLoading ? <SyncLoader color={isValid ? "#ffffff" : "#6b7280"} size={8} /> : <>Login <FiArrowRight /></>}
                  </motion.button>
                </motion.form>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t dark:border-gray-700 border-gray-300"></div>
                  <span className="flex-shrink mx-4 dark:text-gray-400 text-gray-500">or</span>
                  <div className="flex-grow border-t dark:border-gray-700 border-gray-300"></div>
                </div>

                <GoogleSignIn />

                <p className="text-center dark:text-gray-400 text-gray-600">
                  Don't have an account?{' '}
                  <span onClick={() => { router.push('/register'); onClose(); }} className="cursor-pointer text-purple-400 hover:underline font-medium">
                    Register
                  </span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-purple-400">Reset Password</h3>
                  <p className="dark:text-gray-400 text-gray-600 mt-2">Enter your email to receive a reset link</p>
                </div>

                <div>
                  <motion.div className="flex items-center dark:bg-gray-800 bg-gray-100 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500">
                    <FiMail className="dark:text-gray-400 text-gray-500 mr-2" />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent focus:outline-none dark:placeholder-gray-400 placeholder-gray-500"
                    />
                  </motion.div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 dark:bg-gray-700 bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 rounded-lg font-medium transition-all dark:text-gray-200 text-gray-800"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleForgotPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 rounded-lg font-medium transition-all text-white"
                  >
                    {buttonLoading ? (
                      <div className="flex justify-center items-center gap-2">
                        <FiLoader className="animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      'Send Link'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DialogContextSimple>
  );
};

export default LoginDialog;










// 'use client';

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { FiMail, FiArrowRight, FiLoader } from 'react-icons/fi';
// import { FcLock } from 'react-icons/fc';
// import { SyncLoader } from 'react-spinners';
// import Link from 'next/link';
// import GoogleSignIn from '../GoogleLogin';

// const LoginDialog = ({ show, setShow }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const isValid = email && password;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(email, password);
//   };

//   const handleForgotPassword = () => {
//     setButtonLoading(true);
//     setTimeout(() => {
//       alert(`Reset link sent to ${email}`);
//       setButtonLoading(false);
//       setShowForgotPassword(false);
//     }, 1500);
//   };

//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//             className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white space-y-6 relative overflow-hidden"
//           >
//             {/* Animated background elements */}
//             <motion.div
//               className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full filter blur-xl"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             />
//             <motion.div
//               className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/20 rounded-full filter blur-xl"
//               animate={{ rotate: -360 }}
//               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//             />

//             {/* Header */}
//             <motion.div
//               initial={{ y: -10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-center"
//             >
//               <motion.h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
//               </motion.h2>
//               <motion.p
//                 className="text-gray-400 mt-2"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 {showForgotPassword ? 'Enter your email to receive a reset link' : 'Sign in to continue'}
//               </motion.p>
//             </motion.div>

//             {/* Main content with form switching */}
//             <AnimatePresence mode="wait">
//               {!showForgotPassword ? (
//                 <motion.div
//                   key="login-form"
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 10 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-4"
//                 >
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Email Input */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.4 }}
//                     >
//                       <div className="flex items-center bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all">
//                         <FiMail className="text-gray-400 mr-3" size={18} />
//                         <input
//                           type="email"
//                           placeholder="Email"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           className="w-full bg-transparent focus:outline-none placeholder-gray-500"
//                         />
//                       </div>
//                       {errors.email && (
//                         <motion.p
//                           initial={{ opacity: 0, y: -5 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-sm text-red-400 mt-1"
//                         >
//                           {errors.email}
//                         </motion.p>
//                       )}
//                     </motion.div>

//                     {/* Password Input */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.5 }}
//                     >
//                       <div className="flex items-center bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all">
//                         <FcLock className="mr-3" size={18} />
//                         <input
//                           type={showPassword ? 'text' : 'password'}
//                           placeholder="Password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           className="w-full bg-transparent focus:outline-none placeholder-gray-500"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="text-gray-400 hover:text-white transition-colors"
//                         >
//                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                       </div>
//                       {errors.password && (
//                         <motion.p
//                           initial={{ opacity: 0, y: -5 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-sm text-red-400 mt-1"
//                         >
//                           {errors.password}
//                         </motion.p>
//                       )}
//                     </motion.div>

//                     {/* Forgot Password */}
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.6 }}
//                       className="flex justify-end"
//                     >
//                       <button
//                         type="button"
//                         onClick={() => setShowForgotPassword(true)}
//                         className="text-sm text-purple-400 hover:underline transition-colors"
//                       >
//                         Forgot password?
//                       </button>
//                     </motion.div>

//                     {/* Submit Button */}
//                     <motion.button
//                       type="submit"
//                       disabled={!isValid || buttonLoading}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.7 }}
//                       whileHover={isValid && !buttonLoading ? { scale: 1.02 } : {}}
//                       whileTap={isValid && !buttonLoading ? { scale: 0.98 } : {}}
//                       className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
//                         isValid && !buttonLoading
//                           ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30'
//                           : 'bg-gray-700 cursor-not-allowed'
//                       }`}
//                     >
//                       {buttonLoading ? (
//                         <SyncLoader color="#ffffff" size={8} />
//                       ) : (
//                         <>
//                           Login <FiArrowRight className="transition-transform group-hover:translate-x-1" />
//                         </>
//                       )}
//                     </motion.button>
//                   </form>

//                   {/* Divider */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.8 }}
//                     className="relative flex items-center py-4"
//                   >
//                     <div className="flex-grow border-t border-gray-700"></div>
//                     <span className="flex-shrink mx-4 text-gray-400">or</span>
//                     <div className="flex-grow border-t border-gray-700"></div>
//                   </motion.div>

//                   {/* Google Sign In */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.9 }}
//                   >
//                     <GoogleSignIn />
//                   </motion.div>

//                   {/* Register Link */}
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 1 }}
//                     className="text-center text-gray-400"
//                   >
//                     Don't have an account?{' '}
//                     <Link
//                       href="/register"
//                       className="text-purple-400 hover:underline font-medium transition-colors"
//                     >
//                       Register
//                     </Link>
//                   </motion.p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="forgot-password"
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-4"
//                 >
//                   {/* Email Input */}
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     <div className="flex items-center bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all">
//                       <FiMail className="text-gray-400 mr-3" size={18} />
//                       <input
//                         type="email"
//                         placeholder="Your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full bg-transparent focus:outline-none placeholder-gray-500"
//                       />
//                     </div>
//                   </motion.div>

//                   {/* Action Buttons */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     className="flex gap-3"
//                   >
//                     <motion.button
//                       type="button"
//                       onClick={() => setShowForgotPassword(false)}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
//                     >
//                       Back
//                     </motion.button>
//                     <motion.button
//                       type="button"
//                       onClick={handleForgotPassword}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 rounded-lg font-medium transition-all"
//                     >
//                       {buttonLoading ? (
//                         <div className="flex justify-center items-center gap-2">
//                           <FiLoader className="animate-spin" />
//                           Sending...
//                         </div>
//                       ) : (
//                         'Send Link'
//                       )}
//                     </motion.button>
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default LoginDialog;