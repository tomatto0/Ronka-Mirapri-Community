"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const router = useRouter();

  useEffect(() => {
    router.push(`/${keyword ? `?keyword=${keyword}` : ""}`);
  }, [keyword]);

  return null;
}
