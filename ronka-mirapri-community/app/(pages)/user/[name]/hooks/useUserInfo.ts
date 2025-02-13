import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/User";

export const useGetUserInfo = (name: string) => {
  return useQuery({
    queryKey: ["UserInfo", name],
    queryFn: () => getUserInfo(name),
    staleTime: 5000, // 5초
    gcTime: 1000 * 60 * 10, // 30분
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
