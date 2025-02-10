"use client";

import "../../../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostThumbnail from "../../../components/PostThumbnail";
import { useInView } from "react-intersection-observer";
import { Posts, PostInform } from "../../../types/PostInform";
import { useUserPosts, useUserLikedPosts } from "./hooks/useUserPosts";
import { useParams } from "next/navigation";
import { useGetUserInfo } from "./hooks/useUserInfo";

export default function Page_user() {
  const params = useParams<{ name: string }>();
  const userName = params.name;
  const { data: session } = useSession();
  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const [timeline, set_timeline] = useState<string>("userPosts");

  const userInfo = useGetUserInfo(userName);
  const userPosts = useUserPosts(userName, 12);
  const userLikedPosts = useUserLikedPosts(userName, 12);

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && userPosts.hasNextPage) {
      userPosts.fetchNextPage();
    }
  }, [inView, userPosts.hasNextPage]);
  useEffect(() => {
    console.log(userPosts.data);
  }, [userPosts.data]);

  console.log(userInfo?.data?.[0]);

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
          <div className="tlToggle">
            <h3
              className={timeline === "userPosts" ? "active" : ""}
              onClick={() => {
                set_timeline("userPosts");
              }}
            >
              POST
            </h3>
            {session.user.nickname === userInfo?.data?.[0]?.nickname && (
              <h3
                className={timeline === "userPosts" ? "" : "active"}
                onClick={() => {
                  set_timeline("likedPosts");
                }}
              >
                LIKE
              </h3>
            )}
          </div>
        </div>
      )}

      {userInfo.status === "pending" ? (
        <p>Loading...</p>
      ) : userInfo.status === "error" ? (
        <p>
          Error:{" "}
          {userInfo.error instanceof Error
            ? userInfo.error.message
            : "An unknown error occurred"}
        </p>
      ) : (
        <div>
          <p>{userInfo?.data?.[0]?.nickname}</p>
          <p>{userInfo?.data?.[0]?.sns}</p>
        </div>
      )}

      {userPosts.status === "pending" ? (
        <p>Loading...</p>
      ) : userPosts.status === "error" ? (
        <p>
          Error:{" "}
          {userPosts.error instanceof Error
            ? userPosts.error.message
            : "An unknown error occurred"}
        </p>
      ) : timeline === "userPosts" ? (
        <div className="post-container">
          {/* 게시물 목록 렌더링 */}
          {userPosts.data?.pages.map((page: Posts, pageIndex: number) =>
            page.data?.map((post: PostInform, i: number) => (
              <PostThumbnail post={post} key={`${pageIndex}-${i}`} />
            ))
          )}
        </div>
      ) : (
        <div className="post-container">
          {/* 게시물 목록 렌더링 */}
          {userLikedPosts.data?.pages.map((page: Posts, pageIndex: number) =>
            page?.data?.map((post: PostInform, i: number) => (
              <PostThumbnail post={post} key={`${pageIndex}-${i}`} />
            ))
          )}
        </div>
      )}
      <div ref={ref} className="loader">
        {userPosts.isFetchingNextPage && <p>Loading more...</p>}
      </div>

      <div ref={ref} className="loader">
        {userLikedPosts.isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </main>
  );
}
