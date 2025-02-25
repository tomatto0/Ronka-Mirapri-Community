"use client";

import "../css/PostThumbnail.css";
import { useState } from "react";
import { like_toggle } from "../utils/clientfunction";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Image from "next/image";

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
  const pathname = usePathname();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [is_liked, set_is_liked] = useState<boolean>(post.is_liked);

  const like_handler = async () => {
    if (!session?.user.login) {
      const result = await Swal.fire({
        title: "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?",
        icon: "info",
        confirmButtonText: "로그인",
        showCancelButton: true,
        cancelButtonText: "취소",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        sessionStorage.setItem("login_callback", pathname);
        signIn("google", { callbackUrl: "/signup" });
      }
    }
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
            alt="heart"
            id={is_liked ? "fill-heart-teal" : "hollow-heart-white"}
          />
        </button>
      </div>
    </div>
  );
}
