import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import crypto from "crypto";
import { connectDB, User } from "@/app/db/database";

const encrypt_payload = (data: string, encryption_key: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryption_key, "base64"),
    iv
  );
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
};
const decrypt_payload = (encrypted_data: string, encryption_key: string) => {
  const [iv_base64, encrypted] = encrypted_data.split(":");
  const iv = Buffer.from(iv_base64, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryption_key, "base64"),
    iv
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_KEY!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile || !profile.email) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        await connectDB();
        const users = await User.findOne({ email: user.email }).exec();
        if (users) {
          const { email, nickname, sns } = users;
          token.encrypted = encrypt_payload(
            JSON.stringify({ email, nickname, sns }),
            process.env.JWT_ENCRYPTION_KEY!
          );
        } else {
          token.encrypted = encrypt_payload(
            JSON.stringify({ email: user?.email }),
            process.env.JWT_ENCRYPTION_KEY!
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token?.encrypted && typeof token.encrypted === "string") {
          session.user = JSON.parse(
            decrypt_payload(token.encrypted, process.env.JWT_ENCRYPTION_KEY!)
          );
        }
      } catch (e) {
        session.user = {};
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
