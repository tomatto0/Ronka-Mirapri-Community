import { fetchPosts } from "../api/fetchPosts";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePosts = (size: number, filter: string, order: string) => {
  return useInfiniteQuery({
    queryKey: ["posts", size, filter, order],
    queryFn: ({ pageParam }) => fetchPosts(pageParam, size, filter, order),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) return undefined;
      return allPages.length; // 다음 페이지 번호 리턴
    },
  });
};
