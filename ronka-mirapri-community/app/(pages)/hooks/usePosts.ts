import { fetchPosts } from "../api/fetchPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Pages, Posts } from "@/app/types/PostInform";

export interface FetchPostsResponse {
  success: boolean;
  data: Pages[];
  pages: Posts[];
  error?: string;
}

export const usePosts = (size: number, filter: string, order: string) => {
  return useInfiniteQuery<
    FetchPostsResponse, // TData: 쿼리의 반환 데이터 타입
    unknown, // TError: 에러 타입 (기본적으로 unknown)
    FetchPostsResponse, // TData: TData와 동일한 경우 일반적으로 생략 가능
    [string, string, string], // TqueryKey: queryKey의 타입 (기본적으로 배열)
    number // TPageParam: pageParam의 타입
  >({
    queryKey: ["posts", filter, order],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) =>
      fetchPosts(pageParam, size, filter, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.reduce((sum, pages) => sum + pages.data.length, 0);
    },
  });
};
