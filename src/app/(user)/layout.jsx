import CheckUser from "@/components/user/CheckUser";
import Footer from "@/components/user/Footer";
import FooterMobile from "@/components/user/FooterMobile";
import Navbar from "@/components/user/Navbar";
import Script from "next/script";

const Layout = ({ children }) => {
  return (
    <div className="bg-light-1 dark:bg-dark-1 dark:text-white ">

      <Navbar />
      <CheckUser />
      {children}
<Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Footer />
      <FooterMobile />
    </div>
  );
};

export default Layout;