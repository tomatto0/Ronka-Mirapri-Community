"use client";

import IntroducePage from "./components/IntroducePage";
import RulePage from "./components/RulePage";

import { useState } from "react";

import "../../css/About.css";
export default function AboutPage() {
  const [category, set_category] = useState<string>("rule");

  return (
    <>
      <main className="about-wrap">
        <div className="about-toggle">
          <h5
            className={category === "rule" ? "about-tap-active" : ""}
            onClick={() => {
              set_category("rule");
            }}
          >
            운영정책 및 이용가이드
          </h5>

          <>
            <div className="vertical-line" />
            <h5
              className={category === "rule" ? "" : "about-tap-active"}
              onClick={() => {
                set_category("introduce");
              }}
            >
              사이트 소개
            </h5>
          </>
        </div>
        {category === "rule" ? <RulePage /> : <IntroducePage />}
      </main>
    </>
  );
}
