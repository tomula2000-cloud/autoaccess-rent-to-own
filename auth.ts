import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Admin Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email || ""));
        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        const envAdminEmail = normalizeEmail(
          String(process.env.ADMIN_EMAIL || "")
        );
        const envAdminPassword = String(process.env.ADMIN_PASSWORD || "");
        const envAdminName = String(process.env.ADMIN_NAME || "System Admin");

        let user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            passwordHash: true,
          },
        });

        if (user && user.role === "ADMIN" && user.passwordHash) {
          const passwordMatches = await bcrypt.compare(password, user.passwordHash);

          if (!passwordMatches) {
            return null;
          }

          return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            loginType: "ADMIN",
          };
        }

        const canUseEnvFallback =
          envAdminEmail &&
          envAdminPassword &&
          email === envAdminEmail &&
          password === envAdminPassword;

        if (!canUseEnvFallback) {
          return null;
        }

        const passwordHash = await bcrypt.hash(envAdminPassword, 10);

        const restoredAdmin = await prisma.user.upsert({
          where: { email: envAdminEmail },
          update: {
            fullName: envAdminName,
            role: "ADMIN",
            passwordHash,
          },
          create: {
            fullName: envAdminName,
            email: envAdminEmail,
            role: "ADMIN",
            passwordHash,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        });

        return {
          id: restoredAdmin.id,
          name: restoredAdmin.fullName,
          email: restoredAdmin.email,
          role: restoredAdmin.role,
          loginType: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.loginType = (user as { loginType?: string }).loginType;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = String(token.id || "");
        (session.user as { role?: string }).role = String(token.role || "");
        (session.user as { loginType?: string }).loginType = String(
          token.loginType || ""
        );
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin-login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};