"use client";

import "../../../css/PostPageClient.css";
import ItemViewer from "@/app/components/ItemViewer";
import { Item } from "@/app/types/Item";
import { useAddLike, useDeleteLike, useGetPostLikes } from "./hooks/useLike";
import { job_category_group } from "@/app/utils/constants";
import Link from "next/link";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import AutoLink from "@/app/components/AutoLink";
import UserCanvasViewer from "@/app/components/UserCanvasViewer";

export default function PostPageClient({
  post_data,
}: {
  post_data: {
    author: { nickname: string; _id: string };
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
    created_at: string;
  };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const postIndex = post_data.index;
  const postId = post_data._id;
  const postDate = formatDate(new Date(post_data.created_at));
  const jobs = job_summary(post_data.job);
  const imageRef = useRef<HTMLCanvasElement | null>(null);
  function formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const dd = String(date.getDate()).padStart(2, "0"); // 일
    return `${yyyy}.${mm}.${dd}`;
  }
  function job_summary(jobs: string[]) {
    const summary: string[] = [];
    for (let job of jobs) {
      if (job in job_category_group) {
        job_category_group[job].map(i => summary.push(i));
      }
    }
    return jobs.filter(job => !summary.includes(job));
  }
  async function post_delete() {
    const result = await Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      delete_post();
    }
  }

  const { data, isError } = useGetPostLikes(postIndex);
  const { deleteLikeMutation } = useDeleteLike(postIndex);
  const { addLikeMutation } = useAddLike(postIndex);
  const { mutate: delete_post } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/db/posts`, {
          method: "DELETE",
          body: JSON.stringify({ id: postId }),
        });
        const res = await response.json();
        return res;
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(e.message || "삭제 실패");
        }
        throw e;
      }
    },
    onSuccess: async res => {
      if (res.success) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          timer: 3000,
          showConfirmButton: false,
        });
        Toast.fire({ icon: "success", text: "게시글 삭제가 완료되었습니다." });
        router.push("/");
      } else {
        Swal.fire({
          title: "삭제에 실패했습니다.",
          text: res.error ?? "알 수 없는 에러",
          icon: "error",
        });
      }
    },
    onError: error => {
      Swal.fire({
        title: "삭제에 실패했습니다.",
        text: error.message ?? "알 수 없는 에러",
        icon: "error",
      });
    },
  });

  const toggleLike = async () => {
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
    if (data?.is_liked) {
      deleteLikeMutation(postId);
    } else {
      addLikeMutation(postId);
    }
  };
  const [is_modal_open, set_is_modal_open] = useState<boolean>(false);

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

  const image_download = async () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit", // 두 자리 월
      day: "2-digit", // 두 자리 일
      hour: "2-digit", // 두 자리 시간
      minute: "2-digit", // 두 자리 분
      hour12: false, // 24시간제
      timeZone: "Asia/Seoul", // 한국 시간대
    };

    const formattedDate = new Intl.DateTimeFormat("ko-KR", options)
      .format(new Date())
      .replace(". ", "")
      .replace(". ", "")
      .replace(":", "");

    if (imageRef.current instanceof HTMLCanvasElement) {
      const result = await Swal.fire({
        title: "룩북을 다운받으시겠습니까?",
        text: "확장자를 선택해주세요.",
        input: "radio",
        inputValue: "jpg",
        inputOptions: { jpg: "jpg", png: "png" },
        confirmButtonText: "다운로드",
        showCancelButton: true,
        cancelButtonText: "취소",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        if (result.value === "jpg") {
          const a = document.createElement("a");
          a.href = imageRef.current.toDataURL("image/jpeg");
          a.download = `RonkaMirapri ${formattedDate}.jpg`;
          a.click();
        } else {
          const a = document.createElement("a");
          a.href = imageRef.current.toDataURL("image/png");
          a.download = `RonkaMirapri ${formattedDate}.png`;
          a.click();
        }
      }
    }
  };

  const TagBox = ({ content }: { content: string }) => {
    return <div className="tag-box">{content}</div>;
  };

  if (isError) return <div>에러 발생</div>;

  return (
    <main className="post">
      <div className="post-title-box">
        <p className="post-title">{post_data.title}</p>
        {session?.user._id === post_data.author._id ||
        session?.user.is_admin ? (
          <div className="setting">
            <button
              className="post-edit"
              onClick={() => {
                set_is_modal_open(prev => !prev);
              }}
            >
              <img alt="edit icon" id="edit" />
            </button>
            <div
              className={`post-edit-modal ${
                is_modal_open ? "modal-active" : ""
              }`}
            >
              <Link href={`/editor/${postIndex}`}>수정하기</Link>
              <button onClick={post_delete}>삭제하기</button>
            </div>
          </div>
        ) : (
          <div className="setting"></div>
        )}
        <hr />
        <div className="post-subtitle-box">
          <Link
            href={`/user/${post_data.author.nickname}`}
            className="post-author"
          >
            {post_data.author.nickname}
          </Link>
          <p className="post-date">{postDate}</p>
        </div>
        {/* <div> */}
        <div className="like-button-container">
          <button className="like-button" onClick={toggleLike}>
            <img
              alt="heart"
              id={data?.is_liked ? "fill-heart-green" : "hollow-heart-green"}
            />
            <span>{data?.like_count}</span>
          </button>
        </div>
      </div>
      <div className="image-container">
        <img
          className="post-image"
          src={post_data.image_url}
          alt={post_data.title}
        />
        <div className="download-container" onClick={image_download}>
          <img alt="download" id="download" />
        </div>
      </div>
      <div className="post-information">
        <ItemViewer equiped_item={post_data.equiped_item} />
        <div className="tag-container">
          <TagBox content={post_data.gender} />
          <TagBox content={post_data.race} />
          {jobs.map(job => (
            <TagBox content={job} key={`job-${job}`} />
          ))}
          {post_data.tag.map(tag => (
            <TagBox content={tag} key={`tag-${tag}`} />
          ))}
        </div>
      </div>
      <p className="post-content">{post_data.content}</p>
      {post_data.sns && (
        <div className="post-sns-container">
          <p className="post-subtitle">SNS 게시글</p>
          <AutoLink className="post-sns" target="_blank">
            {post_data.sns}
          </AutoLink>
        </div>
      )}
      <div className="post-share-container">
        <p className="post-subtitle">공유하기</p>
        <div className="share-button-container">
          <button className="share-button bluesky" onClick={share_bluesky} />
          <button className="share-button twitter" onClick={share_twitter} />
        </div>
      </div>
      <div style={{ display: "none" }}>
        <UserCanvasViewer
          image_src={post_data.image_url}
          equiped_item={post_data.equiped_item}
          ref={imageRef}
        />
      </div>
    </main>
  );
}
