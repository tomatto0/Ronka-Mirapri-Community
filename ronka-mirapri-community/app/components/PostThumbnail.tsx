import "../css/PostThumbnail.css";
import { useEffect, useState } from "react";
import { is_like, like_toggle } from "../utils/clientfunction";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type PostInform = {
  _id: string;
  index: number;
  title: string;
  image_url: string;
  like_count: number;
  is_liked: boolean;
};

export default function PostThumbnail({
  post,
  queryKey,
  index,
}: {
  post: PostInform;
  queryKey?: any[];
  index?: number[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [is_liked, set_is_liked] = useState<boolean>(post.is_liked);

  const like_handler = async () => {
    set_is_liked(prev => !prev);
    await like_toggle(post._id);

    // 좋아요 변경 후 post.is_liked 갱신
    if (queryKey && index) {
      const data = queryClient.getQueryData<{
        pages: any[];
        pageParams: number[];
      }>(queryKey);
      if (data) {
        data.pages[index[0]].data[index[1]].is_liked =
          !data.pages[index[0]].data[index[1]].is_liked;
        queryClient.setQueryData(queryKey, data);
      }
    }
  };

  const post_click_handler = () => {
    router.push(`/post/${post.index}`);
  };

  return (
    <div className="post-box">
      <img
        className="post-thumbnail"
        src={post.image_url}
        alt={post.title}
        onClick={post_click_handler}
      />
      <div className="post-box-hover">
        <p>{post.title}</p>
        <button onClick={like_handler}>
          <img
            alt={is_liked ? "채워진 하트" : "빈 하트"}
            id={is_liked ? "fill-heart" : "hollow-heart"}
          />
        </button>
      </div>
    </div>
  );
}
