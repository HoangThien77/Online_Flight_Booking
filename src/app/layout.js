"use client";
import "../app/globals.css";
import { usePathname } from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SessionProviderWrapper from "@/context/SessionProviderWrapper";
import PageTransition from "@/lib/PageTransition";
import { NextUI } from "@/context/NextUIProvider";
import ReactQueryProvider from "@/context/ReactQueryProvider";

export default function RootLayout({ children }) {
  // hello
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <NextUI>
          <SessionProviderWrapper>
            <ReactQueryProvider>
              {/* Chỉ hiển thị Navbar và Footer nếu không phải là trang admin */}
              {!isAdmin && <Navbar />}
              <PageTransition>{children}</PageTransition>
              {!isAdmin && <Footer />}
            </ReactQueryProvider>
          </SessionProviderWrapper>
        </NextUI>
      </body>
    </html>
  );
}
