"use client";

import UserViewer from "@/app/components/UserViewer";
import { Item } from "@/app/types/Item";
import { useAddLike, useDeleteLike, useGetPostLikes } from "./hooks/useLike";

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
  const postIndex = post_data.index;
  const postId = post_data._id;

  const { data, isLoading, isError } = useGetPostLikes(postIndex);
  const { deleteLikeMutation } = useDeleteLike(postIndex);
  const { addLikeMutation } = useAddLike(postIndex);

  const toggleLike = () => {
    if (data?.is_liked) {
      deleteLikeMutation(postId);
    } else {
      addLikeMutation(postId);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

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
      <p>좋아요: {data?.like_count}</p>
      <button
        onClick={() => {
          toggleLike();
        }}
      >
        like {data?.is_liked ? "V" : ""}
      </button>
    </main>
  );
}
