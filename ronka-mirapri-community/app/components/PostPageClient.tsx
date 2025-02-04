"use client";

import UserViewer from "@/app/components/UserViewer";
import { Item } from "@/app/types/Item";
import { useMutation, useQuery } from "@tanstack/react-query";

async function is_like_fetch(index: number, id: string) {}
export default function PostPageClient({
  post_data,
}: {
  post_data: {
    author: { nickname: string };
    _id: string;
    index: number;
    image_url: string;
    equiped_item: Item[];
    title: string;
    content: string;
    sns: string;
    gender: string;
    race: string;
    job: string[];
    tag: string[];
    like_count: number;
  };
}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", post_data.index],
    queryFn: async () => {
      const response = await fetch(
        `/api/db/posts/index/likes?index=${post_data.index}`
      );
      return await response.json();
    },
  });
  console.log(data);
  return (
    <main>
      <div className="main-container">
        <UserViewer
          image_src={post_data.image_url}
          equiped_item={post_data.equiped_item}
        ></UserViewer>
      </div>
      <p>작성자: {post_data.author.nickname}</p>
      <hr />
      <p>제목: {post_data.title}</p>
      <p>내용: {post_data.content}</p>
      <p>sns: {post_data.sns}</p>
      <p>성별: {post_data.gender}</p>
      <p>종족: {post_data.race}</p>
      <p>직업: {post_data.job.join(", ")}</p>
      <p>태그: {post_data.tag.join(", ")}</p>

      <p>좋아요: {!isLoading && data.like_count}</p>
      <button>like {!isLoading && data.is_liked ? "V" : ""}</button>
    </main>
  );
}
