"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { filter_tag_init_state } from "../../utils/constants";

interface SearchParamsHandlerProps {
  set_filter_tag: Dispatch<SetStateAction<typeof filter_tag_init_state>>;
}

export default function SearchParamsHandler({
  set_filter_tag,
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    set_filter_tag(prev => ({
      ...prev,
      keyword: searchParams.get("keyword") ?? prev.keyword,
    }));
  }, [searchParams]);

  return null;
}
