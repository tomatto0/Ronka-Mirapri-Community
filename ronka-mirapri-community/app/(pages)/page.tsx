"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";
import FilterSelector from "../components/FilterSelector";
import { usePosts } from "./hooks/usePosts";
import { useInView } from "react-intersection-observer";
import { Posts, PostInform } from "../types/PostInform";

export default function Page_home() {
  const { data: session } = useSession();
  const [filter, set_filter] = useState<string>("{}");
  const [order, set_order] = useState<string>("최신순");

  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = usePosts(12, filter, order);

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);
  useEffect(() => {
    console.log(data);
  }, [data]);

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
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>
          Error:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      ) : (
        <div className="post-container">
          {/* 게시물 목록 렌더링 */}
          {data?.pages.map((page: Posts, pageIndex: number) =>
            page.data?.map((post: PostInform, i: number) => (
              <PostThumbnail post={post} key={`${pageIndex}-${i}`} />
            ))
          )}
        </div>
      )}

      <div ref={ref} className="loader">
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </main>
  );
}
