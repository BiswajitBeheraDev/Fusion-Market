// auth.config.ts (optional)
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // callbacks, authorized, etc. can go here later
} satisfies NextAuthConfig;