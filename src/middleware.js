// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Lấy token từ cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Nếu không có token và đang truy cập trang admin, chuyển hướng đến trang đăng nhập
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && token.role !== "ADMIN") {
    const url = new URL("/", request.url);
    url.searchParams.set("no-access", "true");
    return NextResponse.redirect(url);
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
