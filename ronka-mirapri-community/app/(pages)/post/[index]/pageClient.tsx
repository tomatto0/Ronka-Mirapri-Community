"use client";

import "../../../css/PostPageClient.css";
import ItemViewer from "@/app/components/ItemViewer";
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

  const share_twitter = () => {
    const href = "https://twitter.com/intent/tweet?";
    const text = "롱카의 투영기록?에서 제 새로운 투영을 확인해보세요!";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postIndex}`;
    const hashtags = "롱카의_투영기록";
    window.open(
      `${href}text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        url
      )}&hashtags=${encodeURIComponent(hashtags)}`,
      "_blank"
    );
  };
  const share_bluesky = () => {
    const href = "https://bsky.app/intent/compose?";
    const text = "롱카의 투영기록?에서 제 새로운 투영을 확인해보세요!";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postIndex}`;
    const hashtags = "롱카의_투영기록";
    window.open(
      `${href}text=${encodeURIComponent(`${text} ${url} #${hashtags}`)}`,
      "_blank"
    );
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <main>
      <div className="main-container">
        <img
          className="post-image"
          src={post_data.image_url}
          alt={post_data.title}
        />
        <div>
          <ItemViewer equiped_item={post_data.equiped_item} />
          <p>{post_data.tag.join(", ")}</p>
        </div>
      </div>
      <p>작성자: {post_data.author.nickname}</p>
      <hr />
      <p>제목: {post_data.title}</p>
      <p>내용: {post_data.content}</p>
      <p>sns: {post_data.sns}</p>
      <p>성별: {post_data.gender}</p>
      <p>종족: {post_data.race}</p>
      <p>직업: {post_data.job.join(", ")}</p>
      <p>좋아요: {data?.like_count}</p>
      <button
        onClick={() => {
          toggleLike();
        }}
      >
        like {data?.is_liked ? "V" : ""}
      </button>
      <button onClick={share_twitter}>Xwitter</button>
      <button onClick={share_bluesky}>bluesky</button>
    </main>
  );
}
