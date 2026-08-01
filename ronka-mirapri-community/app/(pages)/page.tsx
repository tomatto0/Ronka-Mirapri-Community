// app/page.tsx
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { getPostsList } from "@/app/lib/service/getPostsList";
import { filter_tag_init_state } from "@/app/utils/constants";
import HomeClient from "@/app/components/home/HomeClient";

const SIZE = 12;
const INITIAL_FILTER = "{}"; // filter_tag_init_state 기준으로 계산된 초기 filter와 동일해야 합니다
const INITIAL_ORDER = filter_tag_init_state.order;

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await getServerSession(authOptions);

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", INITIAL_FILTER, INITIAL_ORDER],
    queryFn: () =>
      getPostsList(0, SIZE, JSON.parse(INITIAL_FILTER), INITIAL_ORDER === "인기순", session),
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
