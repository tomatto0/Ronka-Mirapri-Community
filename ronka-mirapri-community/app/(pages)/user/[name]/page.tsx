"use client";
import "../../../css/home.css";
import "../../../css/User.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostThumbnail from "../../../components/PostThumbnail";
import { useInView } from "react-intersection-observer";
import { Posts, PostInform } from "../../../types/PostInform";
import { useUserPosts, useUserLikedPosts } from "./hooks/useUserPosts";
import { useParams } from "next/navigation";
import { useGetUserInfo } from "./hooks/useUserInfo";
import AutoLink from "@/app/components/AutoLink";

export default function Page_user() {
  const params = useParams<{ name: string }>();
  const userName = params.name;
  const { data: session } = useSession();
  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const [timeline, set_timeline] = useState<string>("userPosts");

  const userInfo = useGetUserInfo(userName);
  const userPosts = useUserPosts(userName, 12);
  const [post_chunk, set_post_chunk] = useState<PostInform[][]>([[]]);
  const userLikedPosts = useUserLikedPosts(userName, 12);
  const [like_chunk, set_like_chunk] = useState<PostInform[][]>([[]]);

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView) {
      if (timeline === "userPosts" && userPosts.hasNextPage) {
        userPosts.fetchNextPage();
      } else if (timeline === "likedPosts" && userLikedPosts.hasNextPage) {
        userLikedPosts.fetchNextPage();
      }
    }
  }, [inView, userPosts.hasNextPage]);

  useEffect(() => {
    if (!userPosts.data) {
      return;
    }
    const post_list = userPosts.data?.pages.reduce<PostInform[]>((acc, _) => {
      return [...acc, ...(_.data ?? [])];
    }, []);
    const post_chunk = post_list.reduce<PostInform[][]>((acc, _, i) => {
      if (i % 4 === 0) {
        acc.push(post_list.slice(i, i + 4));
      }
      return acc;
    }, []);
    set_post_chunk(post_chunk);
  }, [userPosts.data]);

  useEffect(() => {
    if (!userLikedPosts.data) {
      return;
    }
    const post_list = userLikedPosts.data?.pages.reduce<PostInform[]>(
      (acc, _) => {
        return [...acc, ...(_.data ?? [])];
      },
      []
    );
    const post_chunk = post_list.reduce<PostInform[][]>((acc, _, i) => {
      if (i % 4 === 0) {
        acc.push(post_list.slice(i, i + 4));
      }
      return acc;
    }, []);
    set_like_chunk(post_chunk);
  }, [userLikedPosts.data]);

  return (
    <main className="user">
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
        <div className="user-card">
          <div>
            <p className="user-name">{userInfo?.data?.nickname}</p>
            <AutoLink className="user-sns" target="_blank">
              {userInfo?.data?.sns.toUpperCase()}
            </AutoLink>
            <button className="user-setting">
              <img alt="setting" id="setting" />
            </button>
          </div>
          <p className="user-like">{userInfo?.data?.like_count}</p>
        </div>
      )}

      <div className="tlToggle">
        <h3
          className={timeline === "userPosts" ? "active" : ""}
          onClick={() => {
            set_timeline("userPosts");
            userPosts.refetch();
          }}
        >
          POST
        </h3>
        <div className="vertical-line" />
        {session?.user.nickname === userInfo?.data?.nickname && (
          <h3
            className={timeline === "userPosts" ? "" : "active"}
            onClick={() => {
              set_timeline("likedPosts");
              userLikedPosts.refetch();
            }}
          >
            LIKE
          </h3>
        )}
      </div>

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
          {post_chunk.map((chunk: PostInform[], i: number) => (
            <div className="post-container-row" key={i + 1}>
              {chunk.map((post: PostInform, i: number) => (
                <PostThumbnail post={post} key={`post-${post.index}`} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="post-container">
          {/* 게시물 목록 렌더링 */}
          {like_chunk.map((chunk: PostInform[], i: number) => (
            <div className="post-container-row" key={i + 1}>
              {chunk.map((post: PostInform, i: number) => (
                <PostThumbnail post={post} key={`post-${post.index}`} />
              ))}
            </div>
          ))}
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
