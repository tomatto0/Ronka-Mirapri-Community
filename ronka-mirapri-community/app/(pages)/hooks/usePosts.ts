"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "./postsQueryOptions";

export const usePosts = (size: number, filter: string, order: string) => {
  return useInfiniteQuery(postsQueryOptions(size, filter, order));
};
