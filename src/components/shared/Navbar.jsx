/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const Navbar = () => {
  const { data: session } = useSession();

  console.log(session);

  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleBookingSearchClick = () => {
    router.push("booking-search");
  };

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (pathname === "/") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pathname]);

  const isHomePage = pathname === "/";
  const navbarBgColor = isHomePage
    ? isScrolled
      ? "bg-[#00264e]"
      : "bg-transparent"
    : "bg-[#00264e]";

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-500 ${navbarBgColor} px-6 py-4 text-white`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <img
            src="/images/Logo4.png"
            alt="vemaybay.vn logo"
            className="h-10 w-auto cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>

        <div className="hidden space-x-6 lg:flex">
          <div className="flex items-center space-x-2">
            <FaPhoneAlt />
            <span className="text-sm">0912 345 678</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaPhoneAlt />
            <span className="text-sm">(028) 77 777 777</span>
          </div>
        </div>

        <div className="flex items-center space-x-10">
          {session ? (
            <div className="flex items-center space-x-2">
              <Dropdown css={{ color: "white " }}>
                <DropdownTrigger>
                  <Button variant="light">
                    <FaUserCircle className="text-2xl text-white" />
                    <span className="text-sm text-white">
                      {session.user.email}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    onClick={() => router.push("/profile")}
                  >
                    Tài khoản
                  </DropdownItem>
                  <DropdownItem
                    key="bookings"
                    onClick={() => router.push("/my-bookings")}
                  >
                    Lịch sử đặt vé
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <button
              className="flex items-center space-x-2"
              onClick={handleLoginClick}
            >
              <FaUserCircle className="text-2xl" />
              <span className="text-sm">Đăng nhập / Đăng ký</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
