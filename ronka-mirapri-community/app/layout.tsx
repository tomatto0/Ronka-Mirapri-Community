"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="파판14 코디(투영세트) 이미지 생성기"
        />
        <title>롱카의 투영기록?</title>
        {/* <!-- Google Tag Manager --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f)})(window,document,"script","dataLayer","GTM-NTZXPT4C");`,
          }}
        />
        {/* <!-- End Google Tag Manager --> */}

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0B330M6050"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0B330M6050');
          `,
          }}
        />
        {/* End Google Analytics */}
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
              <img alt="FFXIV-KOR MIRAPRI GENERATOR" id="title" />
            </div>
            <SessionProvider>{children}</SessionProvider>
            <div className="footer">
              <a href="https://ronkacloset.com">https://ronkacloset.com</a>
              <br />
              <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
