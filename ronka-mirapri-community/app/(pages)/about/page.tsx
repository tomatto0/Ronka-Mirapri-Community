"use client";

import IntroducePage from "./components/IntroducePage";
import RulePage from "./components/RulePage";

import { useState } from "react";

export default function AboutPage() {
  const [category, set_category] = useState<string>("rule");

  return (
    <>
      <div className="tlToggle">
        <h3
          className={category === "rule" ? "user-tap-active" : ""}
          onClick={() => {
            set_category("rule");
          }}
        >
          운영 정책 및 이용 가이드
        </h3>

        <>
          <div className="vertical-line" />
          <h3
            className={category === "rule" ? "" : "user-tap-active"}
            onClick={() => {
              set_category("introduce");
            }}
          >
            사이트 소개
          </h3>
        </>
      </div>
      {category === "rule" ? <RulePage /> : <IntroducePage />}
    </>
  );
}
