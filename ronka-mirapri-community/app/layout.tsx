import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ReactQueryConfigContext from "@/provider/ReactQueryConfigContext";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

// export const metadata: Metadata = {
//   title: "롱카의 투영기록?",
//   description: "파판14 코디 커뮤니티",
//   icons: {
//     icon: "/logo/favicon.png",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // function onclick_handler() {
  //   window.location.href = "/";
  // }
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
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
        {/* <!-- Google Search console (noscript) --> */}
        <meta
          name="google-site-verification"
          content="UJRNKnijwobnk4mrxPmb1GkeZyxIPW6CNDv7QxaF4MU"
        />
        {/* <!-- End Google Search console (noscript) --> */}
        <noscript>
          이 사이트는 javascript를 허용해야 정상적으로 동작합니다.
        </noscript>
        <div id="root">
          <div className="App">
            <div className="header">
              <img
                alt="Ronka LookBook logo"
                id="title"
                // onClick={onclick_handler}
              />
            </div>
            <SessionProvider>
              <ReactQueryConfigContext>{children}</ReactQueryConfigContext>
            </SessionProvider>
            <div className="footer">
              <a href="https://ronkacloset.com">https://ronkacloset.com</a>
              <br />
              <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
            </div>
          </div>
        </div>
      </body>
      {/* Google Analytics */}
      <GoogleAnalytics gaId="G-0B330M6050" />
      {/* End Google Analytics */}
      {/* <!-- Google Tag Manager --> */}
      <GoogleTagManager gtmId="GTM-NTZXPT4C" />
      {/* <!-- End Google Tag Manager --> */}
    </html>
  );
}
