// <ThemeProvider>
"use client";
import CategoryGrid from "@/components/user/CategoryGrid";
import FeaturedProducts from "@/components/user/FeaturedProducts";
import HeroSection from "@/components/user/heroSection";
import { toast } from "react-toastify";

function App() {
  return (
    <div className="transition-colors duration-300">
      {/* <button
        onClick={() =>
          toast.success("🦄 Wow so easy!", {
            position: "top-left",
            autoClose: 5000,
          })
        }
      >
        toast
      </button> */}
      <main>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
    </div>
  );
}

export default App;
