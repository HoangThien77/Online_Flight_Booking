import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "text", placeholder: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          console.log(user);

          return {
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Thời gian sống của JWT là 24 giờ
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email }, // Sử dụng user.email thay vì token.email
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "USER",
            provider: "google",
            providerAccountId: user.id,
          },
        });

        // Thêm thông tin vào token
        token.id = dbUser.id;
        token.role = dbUser.role;
      } else if (user) {
        // Xử lý đăng nhập credentials
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }

      session.user = {
        ...session.user,
        id: token.id,
        role: token.role,
      };
      console.log(session);

      return session;
    },

    // Thêm signIn callback để lấy thông tin user Google
    async signIn({ user, account }) {
      if (account.provider === "google") {
        return true;
      }

      return true;
    },
  },
});
