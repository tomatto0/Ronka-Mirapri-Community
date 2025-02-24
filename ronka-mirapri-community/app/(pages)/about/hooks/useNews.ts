import { useQuery } from "@tanstack/react-query";
import { getNews } from "../api/fetchnews";

export const useGetNews = () => {
  return useQuery({
    queryKey: ["News"],
    queryFn: () => getNews(),
    staleTime: 5000, // 5초
    gcTime: 1000 * 60 * 10, // 30분
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
