import { useState } from "react";
import { like_toggle } from "../utils/clientfunction";
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

export default function PostThumbnail({ post }: { post: PostInform }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [is_liked, set_is_liked] = useState<boolean>(post.is_liked);

  const like_handler = async () => {
    set_is_liked(prev => !prev);
    await like_toggle(post._id);

    // ✅ 좋아요 변경 후 userLikedPosts 쿼리 갱신
    queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
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
      <div>
        <p>{post.title}</p>
        <button onClick={like_handler}>{is_liked ? "O" : "X"}</button>
      </div>
    </div>
  );
}
