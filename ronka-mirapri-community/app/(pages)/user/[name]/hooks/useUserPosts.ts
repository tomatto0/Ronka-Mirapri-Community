import { getUserPosts, getUserLikedPosts } from "../api/UserPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Pages, Posts } from "@/app/types/PostInform";

export interface FetchPostsResponse {
  success: boolean;
  data: Pages[];
  pages: Posts[];
  error?: string;
}

export const useUserPosts = (name: string, size: number) => {
  return useInfiniteQuery<
    FetchPostsResponse, // TData: 쿼리의 반환 데이터 타입
    unknown, // TError: 에러 타입 (기본적으로 unknown)
    FetchPostsResponse, // TData: TData와 동일한 경우 일반적으로 생략 가능
    [string, string, number], // TqueryKey: queryKey의 타입 (기본적으로 배열)
    number // TPageParam: pageParam의 타입
  >({
    queryKey: ["userPosts", name, size],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) =>
      getUserPosts(pageParam, name, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.reduce((sum, pages) => sum + pages.data.length, 0);
    },
  });
};

export const useUserLikedPosts = (name: string, size: number) => {
  return useInfiniteQuery<
    FetchPostsResponse, // TData: 쿼리의 반환 데이터 타입
    unknown, // TError: 에러 타입 (기본적으로 unknown)
    FetchPostsResponse, // TData: TData와 동일한 경우 일반적으로 생략 가능
    [string, string, number], // TqueryKey: queryKey의 타입 (기본적으로 배열)
    number // TPageParam: pageParam의 타입
  >({
    queryKey: ["userLikedPosts", name, size],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) =>
      getUserLikedPosts(pageParam, name, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.reduce((sum, pages) => sum + pages.data.length, 0);
    },
  });
};
