"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostThumbnail from "../../../components/PostThumbnail";
import { useInView } from "react-intersection-observer";
import { Posts, PostInform } from "../../../types/PostInform";
import { useUserPosts } from "./hooks/useUserPosts";
import { useParams } from "next/navigation";

export default function Page_user() {
  const params = useParams<{ name: string }>();
  const userName = params.name;
  const { data: session } = useSession();
  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useUserPosts(userName);

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  // 개인탐라 / like 타임라인 toggle

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
