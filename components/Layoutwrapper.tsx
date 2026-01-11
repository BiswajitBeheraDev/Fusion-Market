"use client"; // Ye zaroori hai

import { usePathname } from "next/navigation";
import Navbar from "@/components/organisms/navbar";
import Footer from "@/components/organisms/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Jin pages par Navbar/Footer nahi chahiye unhe yahan add karein
  const hideOnPaths = ["/","/login", "/signup"]; 
  const shouldHide = hideOnPaths.includes(pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}