import CategoryGrid from "@/components/user/home/CategoryGrid";
import FeaturedProducts from "@/components/user/home/FeaturedProducts";
import HeroSection from "@/components/user/home/heroSection";
import { getCategories, getProducts } from "@/utils/UserActions";

async function App() {
  const [categories,products] = await Promise.all([getCategories(),getProducts()])
  return (
    <div className="transition-colors duration-300">
      <main>
        <HeroSection />
        <CategoryGrid initialData={categories} />
        <FeaturedProducts initialData={products} />
      </main>
    </div>
  );
}
 
export default App;
