import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="bg-light-1 dark:bg-dark-1 dark:text-white">

      <Navbar />
      {children}

      <Footer />
    </div>
  );
};

export default Layout;