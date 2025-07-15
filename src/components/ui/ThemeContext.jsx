'use client'

import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };


  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        disabled
      >
        <FiSun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    );
  }

  return (
    <button
      className="relative cursor-pointer bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
        {theme === 'dark' ? <FiSun className="" />:<FiMoon className="text-black" />}

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}