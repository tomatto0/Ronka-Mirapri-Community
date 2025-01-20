import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_KEY!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET!,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile || !profile.email) {
        return false;
      }
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   if (url === baseUrl) {
    //     return "/signup";
    //   }
    //   if (url === "/auth/signout") {
    //     return baseUrl;
    //   }
    //   return url || baseUrl;
    // },
    // async session({ session, token }) {
    //   return session;
    // },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
