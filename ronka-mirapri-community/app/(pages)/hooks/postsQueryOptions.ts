// app/hooks/postsQueryOptions.ts
import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchPosts } from "../api/fetchPosts"; // 실제 경로에 맞게 조정 부탁드립니다

export const postsQueryOptions = (size: number, filter: string, order: string) =>
  infiniteQueryOptions({
    queryKey: ["posts", filter, order] as [string, string, string],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      fetchPosts(pageParam, size, filter, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.reduce((sum, page) => sum + page.data.length, 0);
    },
    staleTime: 10 * 60 * 1000,
  });
