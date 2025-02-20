import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import crypto from "crypto";
import { connectDB, User } from "@/app/api/db/database";

//jwt를 암호화
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
//암호화된 jwt를 복호화
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

//next-auth 보안 설정
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
    //구글 인증을 받았을 때 동작, 제대로 profile과 email을 받았는지 확인
    async signIn({ user, account, profile }) {
      if (!profile || !profile.email) {
        return false;
      }
      return true;
    },
    //토큰을 보낼 때/세션을 요청받았을 때 동작
    async jwt({ token, user, trigger, session }) {
      if (token?.login === undefined || token?.login === false) {
        await connectDB();
        const users = await User.findOne({ email: token.email }).exec();
        if (users) {
          //계정이 있는 사용자인 경우 > 사용자 정보를 jwt에 저장
          const { _id, email, nickname, sns } = users;
          token._id = _id;
          token.sns = sns;
          token.encrypted = encrypt_payload(
            JSON.stringify({ _id, email, nickname, sns }),
            process.env.JWT_ENCRYPTION_KEY!
          );
          token.login = true;
        } else {
          //계정이 없는 사용자의 경우 > email만 jwt에 저장, 비로그인 취급
          token.encrypted = encrypt_payload(
            JSON.stringify({ email: token?.email }),
            process.env.JWT_ENCRYPTION_KEY!
          );
          token.login = false;
        }
      }
      //update callback
      if (trigger === "update") {
        if (session.type === "update") {
          token.nickname = session.nickname ?? token.nickname;
          token.sns = session.sns ?? token.sns;
          const { _id, email, nickname, sns } = token;
          token.encrypted = encrypt_payload(
            JSON.stringify({ _id, email, nickname, sns }),
            process.env.JWT_ENCRYPTION_KEY!
          );
        }
      }
      return token; //encrypted로 암호화된 정보를 저장해 전송
    },
    async session({ session, token }) {
      try {
        //token.encrypted를 복호화해 session으로 전달
        if (token?.encrypted && typeof token.encrypted === "string") {
          session.user = JSON.parse(
            decrypt_payload(token.encrypted, process.env.JWT_ENCRYPTION_KEY!)
          );
          session.user.login =
            typeof token?.login == "boolean" ? token.login : undefined;
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
