import { fetchPosts } from "../api/fetchPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostInform } from "@/app/types/PostInform";

interface FetchPostsResponse {
  success: boolean;
  data: PostInform[];
  error?: string;
  pageParam?: number;
}

export const usePosts = (size: number, filter: string, order: string) => {
  return useInfiniteQuery<FetchPostsResponse>({
    queryKey: ["posts", size, filter, order],
    queryFn: ({ pageParam }) =>
      fetchPosts(pageParam as number, size, filter, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || lastPage.data.length === 0) {
        return undefined;
      }
      return allPages.reduce((sum, pages) => sum + pages.data.length, 0);
    },
  });
};
