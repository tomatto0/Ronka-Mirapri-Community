"use client";

import "../css/home.css";
import { useEffect, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";
import FilterSelector from "../components/FilterSelector";
import { usePosts } from "./hooks/usePosts";
import { useInView } from "react-intersection-observer";
import { PostInform } from "../types/PostInform";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Itemrank from "../components/Itemrank";
import {
  filter_tag_init_state,
  job_category,
  job_category_group,
} from "../utils/constants";
import { useRouter } from "next/navigation";

import EditButton from "../components/EditButton";
import ErrorContainer from "../components/ErrorContainer";
import SearchParamsHandler from "./util/SearchParamsHandler";

export default function Page_home() {
  const router = useRouter();

  const [filter, set_filter] = useState<string>("{}");
  const [filter_tag, set_filter_tag] = useState<typeof filter_tag_init_state>(
    filter_tag_init_state
  );
  useEffect(() => {
    const session_filter = JSON.parse(
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("filter") ?? "{}"
        : "{}"
    );
    set_filter_tag(session_filter.filter_tag ?? filter_tag_init_state);
    update_filter();
  }, []);

  const { ref, inView } = useInView(); // 무한 스크롤 트리거 감지
  const [is_open, set_is_open] = useState<boolean>(false);
  const [post_chunk, set_post_chunk] = useState<PostInform[][]>([[]]);

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
    const filter = {
      ...keyword_filter,
      ...gender_filter,
      ...race_filter,
      ...job_filter,
    };
    set_filter(JSON.stringify(filter));
    console.log({ filter });

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "filter",
        JSON.stringify({ filter, filter_tag })
      );
    }
  }

  function job_delete(job: string) {
    function job_groupize(job: string[]) {
      const order_map = new Map(job_category.map((item, i) => [item, i]));
      const groups = Object.keys(job_category_group);
      groups.forEach(group => {
        if (job_category_group[group].every(i => job.includes(i))) {
          if (!job.includes(group)) {
            job = [...job, group];
          }
        } else {
          job = job.filter(i => i !== group);
        }
      });
      job.sort(
        (a, b) =>
          (order_map.get(a) ?? Infinity) - (order_map.get(b) ?? Infinity)
      );
      return job;
    }
    if (Object.keys(job_category_group).includes(job)) {
      const new_job = filter_tag.job.filter(
        i => !job_category_group[job].includes(i) && i !== job
      );
      set_filter_tag(prev => ({
        ...prev,
        job: job_groupize(new_job),
      }));
    } else {
      const new_job = filter_tag.job.filter(i => i !== job);
      set_filter_tag(prev => ({
        ...prev,
        job: job_groupize(new_job),
      }));
    }
  }

  // 무한 스크롤 감지해서 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    update_filter();
    if (filter_tag.keyword !== "") {
      router.push(`/?keyword=${filter_tag.keyword}`);
    } else {
      router.push(`/`);
    }
  }, [filter_tag]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const post_list = data?.pages.reduce<PostInform[]>((acc, _) => {
      return [...acc, ...(_.data ?? [])];
    }, []);
    const post_chunk = post_list.reduce<PostInform[][]>((acc, _, i) => {
      if (i % 4 === 0) {
        acc.push(post_list.slice(i, i + 4));
      }
      return acc;
    }, []);
    set_post_chunk(post_chunk);
  }, [data]);

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
    <Suspense>
      <main className="fill">
        <Suspense fallback={<div>검색어 로딩 중...</div>}>
          <SearchParamsHandler set_filter_tag={set_filter_tag} />
        </Suspense>

        <Suspense>
          <div className="primary-filter-wrap">
            <button
              className="primary-filter filter-open"
              onClick={() => {
                set_is_open(true);
              }}
            >
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                alt="modal open button"
              />
              FILTER
            </button>
            {filter_tag.order !== "최신순" && (
              <button
                className="primary-filter filter-items"
                onClick={() => {
                  set_filter_tag(prev => ({ ...prev, order: "최신순" }));
                }}
              >
                {filter_tag.order}{" "}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/close_green.svg"
                  }
                  alt="modal open button"
                />
              </button>
            )}
            {filter_tag.gender !== "전체" && (
              <button
                className="primary-filter filter-items"
                onClick={() => {
                  set_filter_tag(prev => ({ ...prev, gender: "전체" }));
                }}
              >
                {filter_tag.gender}{" "}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/close_green.svg"
                  }
                  alt="modal open button"
                />
              </button>
            )}
            {filter_tag.keyword !== "" && (
              <button
                className="primary-filter filter-keyword"
                onClick={() => {
                  set_filter_tag(prev => ({ ...prev, keyword: "" }));
                }}
              >
                검색: {filter_tag.keyword}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/close_purple.svg"
                  }
                  alt="modal open button"
                />
              </button>
            )}
            {filter_tag.job.map(job => (
              <button
                className="primary-filter filter-items"
                onClick={() => {
                  job_delete(job);
                }}
                key={`filter-${job}`}
              >
                {job}{" "}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/close_green.svg"
                  }
                  alt="modal open button"
                />
              </button>
            ))}{" "}
            {filter_tag.race.map(race => (
              <button
                className="primary-filter filter-items"
                onClick={() => {
                  set_filter_tag(prev => ({
                    ...prev,
                    race: prev.race.filter(i => i !== race),
                  }));
                }}
                key={`filter-${race}`}
              >
                {race}{" "}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/close_green.svg"
                  }
                  alt="modal open button"
                />
              </button>
            ))}{" "}
            {(filter !== "{}" || filter_tag.order !== "최신순") && (
              <button className="primary-filter" onClick={reset_filter}>
                {" "}
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_URL + "/img/refresh-green.svg"
                  }
                  alt="modal open button"
                />
                초기화
              </button>
            )}
          </div>
        </Suspense>
        <Suspense>
          <FilterSelector
            set_filter={set_filter}
            filter_tag={filter_tag}
            set_filter_tag={set_filter_tag}
            is_open={is_open}
            set_is_open={set_is_open}
          />
        </Suspense>

        {status === "pending" ? (
          <div>
            <span className="loading"></span>
          </div>
        ) : status === "error" ? (
          <p>
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        ) : post_chunk.length === 0 ? (
          <ErrorContainer error_message="해당하는 게시글을 찾을 수 없어요." />
        ) : (
          <>
            <div className="post-container">
              {post_chunk.length > 0 && (
                <div className="post-container-row" key={0}>
                  {post_chunk[0].map((post: PostInform) => (
                    <PostThumbnail post={post} key={`post-${post.index}`} />
                  ))}
                </div>
              )}
            </div>
            <Itemrank itemrank={item_rank.data ?? []} />

            {/* 게시물 목록 렌더링 */}
            <div className="post-container">
              {post_chunk
                .slice(1, post_chunk.length)
                .map((chunk: PostInform[], i: number) => (
                  <div className="post-container-row" key={i + 1}>
                    {chunk.map((post: PostInform) => (
                      <PostThumbnail post={post} key={`post-${post.index}`} />
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}

        <div ref={ref} className="loader">
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>
        <EditButton />
      </main>
    </Suspense>
  );
}
