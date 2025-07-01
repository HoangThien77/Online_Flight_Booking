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
          return {
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
            image: user.image, // Include image here
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        token.id = dbUser.id;
        token.role = dbUser.role;
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.image = dbUser.image; // Fetch from DB
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        token.id = dbUser.id;
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.image = dbUser.image; // Fetch from DB for Credentials
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          image: token.image, // Ensure image is included
        };
      }
      console.log("Session in callback:", session); // Debug log

      return session;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          image: token.image, // Include image in session
        };
      }
      console.log("Session:", session); // Debug log

      return session;
    },

    async signIn({ user, account }) {
      if (account.provider === "google") {
        return true;
      }

      return true;
    },
  },
});
