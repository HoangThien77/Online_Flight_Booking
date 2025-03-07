import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí scroll để hiển thị/ẩn button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Hàm scroll to top với animation mượt
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"} `}
    >
      <div className="relative">
        <ChevronUp className="size-6 animate-bounce" strokeWidth={2.5} />
        <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 blur transition group-hover:opacity-40" />
      </div>
    </button>
  );
};

export default ScrollToTopButton;
