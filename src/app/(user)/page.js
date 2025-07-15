// <ThemeProvider>

import CategoryGrid from "@/components/user/CategoryGrid";
import FeaturedProducts from "@/components/user/FeaturedProducts";
import HeroSection from "@/components/user/heroSection";

function App() {
  return (
      <div className="transition-colors duration-300">
        <main>
          <HeroSection />
          <CategoryGrid />
          <FeaturedProducts />
        </main>
      </div>
  );
}

export default App;
