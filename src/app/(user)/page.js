import CategoryGrid from "@/components/user/home/CategoryGrid";
import FeaturedProducts from "@/components/user/home/FeaturedProducts";
import HeroSection from "@/components/user/home/heroSection";

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
