"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";
import FilterSelector from "../components/FilterSelctor";
import { usePosts } from "./hooks/usePosts";
import { useInView } from "react-intersection-observer";
import { PostInform } from "../types/PostInform";
// import { useInfiniteQuery } from "@tanstack/react-query";

export default function Page_home() {
  const { data: session } = useSession();
  const [filter, set_filter] = useState<string>("{}");
  const [order, set_order] = useState<string>("최신순");

  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(
    12,
    filter,
    order
  );

  console.log("data:", data);

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <main>
      {!session?.user?.login ? (
        <div>
          <p>You are not signed in</p>
          <button onClick={() => signIn("google", { callbackUrl: "/signup" })}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {session.user?.nickname}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}

      <FilterSelector
        set_filter={set_filter}
        order={order}
        set_order={set_order}
      />

      {/* 게시물 목록 렌더링 */}
      <div className="post-container">
        {data?.pages.map((page, pageIndex) =>
          page.data.map((post: PostInform, i: number) => (
            <PostThumbnail post={post} key={`${pageIndex}-${i}`} />
          ))
        )}
      </div>

      {/* 무한 스크롤 로딩 UI */}
      <div ref={ref} className="loader">
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </main>
  );
}
