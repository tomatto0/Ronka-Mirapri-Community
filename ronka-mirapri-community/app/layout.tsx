import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import Providers from "./components/Providers";
import Link from "next/link";
import { pretendard, rem, galmuri } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "롱카의 룩북?",
  description: "ff14 모험가를 위한 투영커뮤니티",
  icons: {
    icon: "/logo/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${rem.variable} ${galmuri.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="UJRNKnijwobnk4mrxPmb1GkeZyxIPW6CNDv7QxaF4MU" />

        <link rel="preconnect" href="https://lookbook.ronkacloset.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={pretendard.className}>
        <GoogleTagManager gtmId="GTM-NTZXPT4C" />
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NTZXPT4C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}

        <noscript>이 사이트는 javascript를 허용해야 정상적으로 동작합니다.</noscript>
        <div id="root">
          <div className="App">
            <Providers>{children}</Providers>

            <div className="footer">
              <Link href="https://ronkacloset.com" target="_blank">
                https://ronkacloset.com
              </Link>
              <br />
              <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
            </div>
          </div>
        </div>
      </body>

    </html>
  );
}
