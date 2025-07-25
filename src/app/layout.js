import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import StoreProvider from "@/redux/storeProvider";
import ToastContext from "@/components/ui/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Order It Online",
  description: "A platform to order products online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-light-1 dark:bg-dark-1 dark:text-white `}
      >
        <StoreProvider>
          <ThemeProvider attribute="class">
            <ToastContext />
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
