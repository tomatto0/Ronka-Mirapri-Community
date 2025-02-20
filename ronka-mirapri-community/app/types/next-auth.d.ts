import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      email?: string;
      nickname?: string;
      sns?: string;
      login?: boolean;
      is_admin?: boolean;
    };
    login_callback?: string;
  }
}
