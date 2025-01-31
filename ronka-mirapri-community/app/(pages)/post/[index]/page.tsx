"use client";

import UserViewer from "@/app/components/UserViewer";
import { Item } from "@/app/types/Item";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UserPage() {
  const { data: session, status } = useSession();
  const [author, set_author] = useState<string>("");
  const [post_id, set_post_id] = useState<string>("");
  const [image_src, set_image_src] = useState<string>("");
  const [equiped_item, set_equiped_item] = useState<Item[]>([]);
  const [is_loaded, set_is_loaded] = useState<boolean>(false);
  const [title, set_title] = useState<string>("");
  const [content, set_content] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const [gender, set_gender] = useState<string>("공용");
  const [race, set_race] = useState<string | null>(null);
  const [job, set_job] = useState<string[]>(["모든 클래스"]);
  const [tag, set_tag] = useState<string[]>([]);
  const [like, set_like] = useState<number>(0);
  const imageRef = useRef<HTMLCanvasElement | null>(null);
  const x = useRef<number>(0);
  const pathname = usePathname();
  const index = pathname.split("/").pop();

  async function post_data_fetch() {
    const response = await fetch(`/api/db/posts/index?index=${index}`, {
      method: "GET",
    });
    const res = await response.json();
    console.log(res);
    set_author(res.data.author.nickname);
    set_post_id(res.data._id);
    set_image_src(res.data.image_url);
    set_equiped_item(res.data.equiped_item);
    set_title(res.data.title);
    set_content(res.data.content);
    set_sns(res.data.sns);
    set_gender(res.data.gender);
    set_race(res.data.race);
    set_job(res.data.job);
    set_tag(res.data.tag);
    set_is_loaded(true);
  }
  async function like_data_fetch() {
    const response = await fetch(`/api/db/posts/index/likes?index=${index}`, {
      method: "GET",
    });
    const res = await response.json();
    console.log(res);
    set_like(res.data.like_count);
  }

  async function like_onclick_handler() {
    if (!session?.user.login) {
      return;
    }
    const response = await fetch(`/api/db/likes?id=${post_id}`, {
      method: "GET",
    });
    const res = await response.json();
    if (res.data) {
      const like_response = await fetch(`/api/db/likes`, {
        method: "DELETE",
        body: JSON.stringify({ post: post_id }),
      });
    } else {
      const like_response = await fetch(`/api/db/likes`, {
        method: "POST",
        body: JSON.stringify({ post: post_id }),
      });
    }
    like_data_fetch();
  }

  useEffect(() => {
    post_data_fetch();
    like_data_fetch();
  }, []);

  if (!is_loaded) {
    return;
  }
  return (
    <div>
      <div className="main-container">
        <UserViewer
          image_src={image_src}
          equiped_item={equiped_item}
          set_image_src={set_image_src}
          x={x}
          imageRef={imageRef}
        ></UserViewer>
      </div>
      <p>작성자: {author}</p>
      <hr />
      <p>제목: {title}</p>
      <p>내용: {content}</p>
      <p>sns: {sns}</p>
      <p>성별: {gender}</p>
      <p>종족: {race}</p>
      <p>직업: {job.join(", ")}</p>
      <p>태그: {tag.join(", ")}</p>
      <p>
        좋아요: {like} <button onClick={like_onclick_handler}>+</button>
      </p>
    </div>
  );
}
