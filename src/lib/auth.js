// src/lib/auth.js
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        // In a real application, you should compare hashed passwords
        // This is just for demonstration
        if (credentials.password !== user.password) {
          return null;
        }

        return user;
      },
    }),
    // Add other providers as needed
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = parseInt(token.sub);
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id.toString();
      }

      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    // Add other custom pages if needed
  },
};
