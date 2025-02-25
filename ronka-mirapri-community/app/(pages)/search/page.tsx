"use client";

import { Suspense } from "react";
import SearchParamsHandler from "./util/SearchParamsHandler";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>검색 중...</div>}>
      <SearchParamsHandler />
    </Suspense>
  );
}
