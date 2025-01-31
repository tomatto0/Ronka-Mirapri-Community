import { useState } from "react";
import { is_like, like_toggle } from "../utils/clientfunction";

type PostInform = {
  _id: string;
  index: number;
  title: string;
  image_url: string;
  like_count: number;
  is_liked: boolean;
};

export default function PostThumbnail({ post }: { post: PostInform }) {
  const [is_liked, set_is_liked] = useState<boolean>(post.is_liked);
  const like_handler = async () => {
    await like_toggle(post._id);
    set_is_liked(await is_like(post._id));
  };

  const post_click_handler = () => {
    window.location.href = `/post/${post.index}`;
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
