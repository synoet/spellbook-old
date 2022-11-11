import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile: (profile) => {
        return {
          username: profile.login,
          id: profile.id,
          image: profile.avatar_url,
          email: profile.email,
          name: profile.name,
          emailVerified: profile.created_at,
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session && (session.user = user);
      return session;
    },
  },
};

export default NextAuth(authOptions);
