"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcAddImage } from 'react-icons/fc';
import { FiUser, FiMail, FiLock, FiCalendar, FiEye, FiEyeOff, FiArrowRight, FiPhone } from 'react-icons/fi';
import { SyncLoader } from 'react-spinners';
import GoogleSignIn from '@/components/user/GoogleLogin';
import LoginDialog from '@/components/user/dialog/LoginDialog';
import { RegisterUser } from '@/utils/UserActions';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slicer/auth';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isLoginDialog, setIsLoginDialog] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const {isUser} = useSelector((state) => state.auth);
  console.log(isUser);


  useEffect(() => {
    if(isUser) router.push('/'); // Redirect to home if user is already logged in
  }, [])



  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (phone.length !== 10) {
      newErrors.phone = 'Invalid Phone Number';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(dob);
      const dobYear = dobDate.getFullYear();
      const currentYear = new Date().getFullYear();
      const minAgeYear = currentYear - 120;

      if (dobYear < minAgeYear || dobYear >= currentYear) {
        newErrors.dob = `Year must be between ${minAgeYear} and ${currentYear - 1}`;
      } else if (currentYear - dobYear < 13) {
        newErrors.dob = 'You must be at least 13 years old';
      }
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email address';
    }

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must include a number';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must include an uppercase letter';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setButtonLoading(true);

      const {data} = await RegisterUser({ image, name, email, phone, password, dob });
      if(data) {
        await dispatch(login(data));
        router.push('/'); // Redirect to home page after successful registration
      }


    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    validate();
  }, [name, email, password, dob, phone]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 relative overflow-hidden"
      >
        {/* Glowing blobs */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40  rounded-full filter blur-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 dark:bg-indigo-600/20 rounded-full filter blur-xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-1 to-pink-500 bg-clip-text text-transparent"
        >
          Join Us Today
        </motion.h2>

        {/* Profile Image Upload */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 120 }} className="flex justify-center">
          <label className="cursor-pointer group">
            <div className="relative">
              {image ? (
                <motion.img
                  src={image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-400 dark:border-gray-600 group-hover:border-green-1 transition-colors">
                  <FcAddImage size={32} />
                </div>
              )}
              <motion.div className="absolute bottom-0 right-0 bg-green-1 rounded-full p-1" whileHover={{ scale: 1.1 }}>
                <FiArrowRight className="text-white" />
              </motion.div>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </motion.div>

        {/* Form Fields */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <InputField icon={<FiUser />} value={name} setValue={setName} placeholder="Full Name" error={errors.name} />
          {/* Email */}
          <InputField icon={<FiMail />} value={email} setValue={setEmail} placeholder="Email" error={errors.email} type="email" />
          <InputField icon={<FiPhone />} value={phone} setValue={setPhone} placeholder="Phone NO" error={errors.phone} type="number" />
          {/* Password */}
          <PasswordField value={password} setValue={setPassword} error={errors.password} show={showPassword} setShow={setShowPassword} />
          {/* Date of Birth */}
          <InputField icon={<FiCalendar />} value={dob} setValue={setDob} placeholder="Date of Birth" type="date" error={errors.dob} />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isValid || buttonLoading}
            whileHover={isValid && !buttonLoading ? { scale: 1.02 } : {}}
            whileTap={isValid && !buttonLoading ? { scale: 0.98 } : {}}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isValid && !buttonLoading
                ? 'bg-gradient-to-r from-green-1 to-pink-600 hover:shadow-lg text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            {buttonLoading ? <SyncLoader color="#fff" size={8} /> : <>Register <FiArrowRight /></>}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* Google Sign In */}
        <GoogleSignIn />

        {/* Footer Link */}
        <p className="text-center text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <span onClick={() => setIsLoginDialog(true)} className="text-green-1 cursor-pointer hover:underline font-medium">
            Login
          </span>
        </p>
      </motion.div>
      {isLoginDialog && <LoginDialog show={isLoginDialog} setShow={setIsLoginDialog} />}
    </div>
  );
}

const InputField = ({ icon, value, setValue, placeholder, type = "text", error }) => (
  <div>
    <motion.div
      className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-green-1"
      whileFocus={{ scale: 1.01 }}
    >
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
        max={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
      />
    </motion.div>
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const PasswordField = ({ value, setValue, error, show, setShow }) => (
  <div>
    <motion.div
      className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus-within:ring-1 focus-within:ring-green-1"
      whileFocus={{ scale: 1.01 }}
    >
      <FiLock className="text-gray-400 mr-2" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Password"
        className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
      />
      <button type="button" onClick={() => setShow(!show)} className="text-gray-400 hover:text-green-1">
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </motion.div>
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </AnimatePresence>



  </div>
);
