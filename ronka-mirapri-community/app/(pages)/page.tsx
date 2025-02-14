"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";
import FilterSelector from "../components/FilterSelector";
import { usePosts } from "./hooks/usePosts";
import { useInView } from "react-intersection-observer";
import { Posts, PostInform } from "../types/PostInform";
import { useQuery } from "@tanstack/react-query";
import Itemrank from "../components/Itemrank";
import { filter_tag_init_state } from "../utils/constants";
import { useSearchParams } from "next/navigation";

export default function Page_home() {
  const { data: session } = useSession();
  const [filter, set_filter] = useState<string>("{}");
  const [filter_tag, set_filter_tag] = useState<typeof filter_tag_init_state>(
    filter_tag_init_state
  );
  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const [is_open, set_is_open] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = usePosts(12, filter, filter_tag.order);

  function update_filter() {
    let keyword_filter = {};
    if (filter_tag.keyword !== "") {
      keyword_filter = {
        equiped_item: {
          $elemMatch: {
            Name: { $regex: filter_tag.keyword, $options: "i" },
          },
        },
      };
    }
    let gender_filter = {};
    if (filter_tag.gender !== "전체") {
      gender_filter = { gender: filter_tag.gender };
    }
    let race_filter = {};
    if (filter_tag.race.length > 0) {
      race_filter = { race: { $in: filter_tag.race } };
    }
    let job_filter = {};
    if (filter_tag.job.length > 0) {
      job_filter = filter_tag.job.includes("모든 클래스")
        ? { job: { $in: filter_tag.job } }
        : { job: { $in: filter_tag.job, $nin: ["모든 클래스"] } };
    }
    set_filter(
      JSON.stringify({
        ...keyword_filter,
        ...gender_filter,
        ...race_filter,
        ...job_filter,
      })
    );
  }

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    update_filter();
  }, [filter_tag]);

  useEffect(() => {
    set_filter_tag(prev => ({
      ...prev,
      keyword: searchParams.get("keyword") ?? "",
    }));
  }, []);

  const fetch_item_rank = async (): Promise<string[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/items/ranking`
    );
    const res = await response.json();
    const item_name = [];
    for (let item of res.data) {
      item_name.push(item[0]);
    }
    return item_name;
  };

  const item_rank = useQuery({
    queryKey: ["item_rank"],
    queryFn: fetch_item_rank,
  });

  function reset_filter() {
    set_filter("{}");
    set_filter_tag(filter_tag_init_state);
  }

  return (
    <main>
      <p>{filter}</p>
      <button
        onClick={() => {
          set_is_open(true);
        }}
      >
        필터 +
      </button>
      {filter_tag.order !== "최신순" && (
        <button
          onClick={() => {
            set_filter_tag(prev => ({ ...prev, order: "최신순" }));
          }}
        >
          {filter_tag.order} X
        </button>
      )}
      {filter_tag.gender !== "전체" && (
        <button
          onClick={() => {
            set_filter_tag(prev => ({ ...prev, gender: "전체" }));
          }}
        >
          {filter_tag.gender} X
        </button>
      )}
      {filter_tag.keyword !== "" && (
        <button
          onClick={() => {
            set_filter_tag(prev => ({ ...prev, keyword: "" }));
          }}
        >
          검색: {filter_tag.keyword} X
        </button>
      )}
      {filter_tag.job.map(job => (
        <button
          onClick={() => {
            set_filter_tag(prev => ({
              ...prev,
              job: prev.job.filter(i => i !== job),
            }));
          }}
          key={`filter-${job}`}
        >
          {job} X
        </button>
      ))}
      {filter_tag.race.map(race => (
        <button
          onClick={() => {
            set_filter_tag(prev => ({
              ...prev,
              race: prev.race.filter(i => i !== race),
            }));
          }}
          key={`filter-${race}`}
        >
          {race} X
        </button>
      ))}
      <button onClick={reset_filter}>초기화</button>
      <FilterSelector
        filter={filter}
        set_filter={set_filter}
        filter_tag={filter_tag}
        set_filter_tag={set_filter_tag}
        is_open={is_open}
        set_is_open={set_is_open}
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
          {data?.pages[0].data
            ?.slice(0, 4)
            .map((post: PostInform, i: number) => (
              <PostThumbnail post={post} key={`post-${post.index}`} />
            ))}
          {/*여기에 주간 인기 넣기*/}
          {data?.pages[0].data
            ?.slice(4, 12)
            .map((post: PostInform, i: number) => (
              <PostThumbnail post={post} key={`post-${post.index}`} />
            ))}
          {/* 게시물 목록 렌더링 */}
          {data?.pages
            .slice(1, data.pages.length)
            .map((page: Posts, pageIndex: number) =>
              page.data?.map((post: PostInform, i: number) => (
                <PostThumbnail post={post} key={`post-${post.index}`} />
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
