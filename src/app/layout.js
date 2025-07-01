"use client";
import "../app/globals.css";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { store } from "@/store"; // Đường dẫn tới file store của bạn
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
        <Provider store={store}>
          <NextUI>
            <SessionProviderWrapper>
              <ReactQueryProvider>
                {!isAdmin && <Navbar />}
                <PageTransition>{children}</PageTransition>
                {!isAdmin && <Footer />}
                <Toaster richColors position="top-right" />
              </ReactQueryProvider>
            </SessionProviderWrapper>
          </NextUI>
        </Provider>
      </body>
    </html>
  );
}
