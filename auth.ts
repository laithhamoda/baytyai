import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
