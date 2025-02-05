"use client";

import UserViewer from "@/app/components/UserViewer";
import { Item } from "@/app/types/Item";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const like = useQuery({
    queryKey: ["posts", post_data.index],
    queryFn: async () => {
      const response = await fetch(
        `/api/db/posts/index/likes?index=${post_data.index}`
      );
      return (await response.json()).data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (like.isLoading) {
        return;
      }
      if (like.data?.is_liked) {
        const response = await fetch(`/api/db/likes`, {
          method: "DELETE",
          body: JSON.stringify({ post: post_data._id }),
        });
        like.refetch();
        return await response.json();
      } else {
        const response = await fetch(`/api/db/likes`, {
          method: "POST",
          body: JSON.stringify({ post: post_data._id }),
        });
        like.refetch();
        return await response.json();
      }
    },
  });
  return (
    <main>
      <img src={post_data.image_url} alt={post_data.title} />
      <UserViewer equiped_item={post_data.equiped_item} />
      <p>작성자: {post_data.author.nickname}</p>
      <hr />
      <p>제목: {post_data.title}</p>
      <p>내용: {post_data.content}</p>
      <p>sns: {post_data.sns}</p>
      <p>성별: {post_data.gender}</p>
      <p>종족: {post_data.race}</p>
      <p>직업: {post_data.job.join(", ")}</p>
      <p>태그: {post_data.tag.join(", ")}</p>
      <p>좋아요: {like.data?.like_count}</p>
      <button
        onClick={() => {
          mutate();
        }}
      >
        like {like.data?.is_liked ? "V" : ""}
      </button>
    </main>
  );
}
