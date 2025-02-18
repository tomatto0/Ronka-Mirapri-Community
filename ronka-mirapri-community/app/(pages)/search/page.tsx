"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const router = useRouter();
  useEffect(() => {
    router.push(`/${keyword ? `?keyword=${keyword}` : ""}`);
  }, []);
}
