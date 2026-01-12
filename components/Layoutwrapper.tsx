"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react"; // 1. Suspense import karo
import Navbar from "@/components/organisms/navbar";
import Footer from "@/components/organisms/footer";

// Ek naya component banaya jo logic handle karega
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnPaths = ["/", "/login", "/signup"];
  const shouldHide = hideOnPaths.includes(pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}

// Main export mein Suspense boundary daal di
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    // Isse Next.js build ke waqt error nahi dega
    <Suspense fallback={null}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}