"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SearchPage() {
  const router = useRouter();
  useEffect(() => {
    sessionStorage.setItem("is_search", "true");
    router.push("/");
  }, []);
}
