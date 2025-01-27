import {
  gender_category,
  race_category,
  job_category,
} from "../utils/constants";
import { useSession } from "next-auth/react";
import { Item } from "../types/Item";
import React, { RefObject, useEffect, useState } from "react";

export default function Editor({
  image_src,
  equiped_item,
  imageRef,
}: {
  image_src: string;
  equiped_item: Item[];
  imageRef: RefObject<HTMLCanvasElement | null>;
}) {
  const { data: session, status } = useSession();

  const [title, set_title] = useState<string>("");
  const [content, set_content] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const [gender, set_gender] = useState<string>("공용");
  const [race, set_race] = useState<string | null>(null);
  const [job, set_job] = useState<string[]>(["모든 클래스"]);
  const [tag, set_tag] = useState<string[]>([]);
  const [tag_input, set_tag_input] = useState<string>("");

  function title_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_title(e.target.value);
  }
  function content_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_content(e.target.value);
  }
  function sns_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_sns(e.target.value);
  }
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_gender(e.target.value);
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_race(e.target.value);
  }
  function job_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_job(
      job.includes(e.target.value)
        ? job.filter((i) => i !== e.target.value)
        : [...job, e.target.value]
    );
  }
  function tag_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    let tag_input = e.target.value;
    if (tag_input.slice(-1) === " ") {
      if (!tag.includes(tag_input.trim())) {
        set_tag([...tag, tag_input.trim()]);
      }
      set_tag_input("");
    } else {
      set_tag_input(tag_input);
    }
  }

  async function post() {
    if (!imageRef.current) {
      return;
    }
    const ctx = imageRef.current.getContext("2d");
    if (!ctx) {
      return;
    }
    const image_data = ctx.getImageData(0, 0, 540, 1080);
    const cropped_canvas = document.createElement("canvas");
    cropped_canvas.width = 540;
    cropped_canvas.height = 1080;
    const cropped_ctx = cropped_canvas.getContext("2d");
    if (!cropped_ctx) {
      return;
    }
    cropped_ctx.putImageData(image_data, 0, 0);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        cropped_canvas.toBlob((blob) => {
          if (blob) {
            return resolve(blob);
          }
          return reject(new Error("Blob 생성 실패"));
        }, "image/png");
      });
      const form = new FormData();
      form.append("image", blob);
      const img_response = await fetch("/api/image", {
        method: "POST",
        body: form,
      });
      if (!img_response.ok) {
        return;
      }
      const img_res = await img_response.json();
      const image_url = img_res.image_url;

      const post_response = await fetch("/api/db/posts", {
        method: "POST",
        body: JSON.stringify({
          image_url: image_url,
          equiped_item: equiped_item,
          title: title,
          content: content,
          tags: tag,
        }),
      });
      if (!post_response.ok) {
        return;
      }
      const post_res = await post_response.json();
      console.log(post_res);
    } catch (e) {
      console.error(e);
    }
  }

  const InputBox = ({
    name,
    value,
    category,
    change_handler,
  }: {
    name: string;
    value: string | null;
    category: string;
    change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return (
      <label htmlFor={`${category}-${name.replace(" ", "-")}`}>
        <span>{name + (value == name ? "O" : "")}</span>
        <input
          type="radio"
          id={`${category}-${name.replace(" ", "-")}`}
          name={category}
          value={name}
          checked={value == name}
          onChange={change_handler}
          style={{ display: "none" }}
        />
      </label>
    );
  };
  const CheckBox = ({
    name,
    value,
    category,
    change_handler,
  }: {
    name: string;
    value: string[];
    category: string;
    change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return (
      <label htmlFor={`${category}-${name.replace(" ", "-")}`}>
        <span>{name + (value.includes(name) ? "O" : "")}</span>
        <input
          type="checkbox"
          id={`${category}-${name.replace(" ", "-")}`}
          name={category}
          value={name}
          checked={value.includes(name)}
          onChange={change_handler}
          style={{ display: "none" }}
        />
      </label>
    );
  };
  const TagBox = ({ value }: { value: string }) => {
    const click_handler = () => {
      set_tag(tag.filter((i) => i !== value));
    };
    return <button onClick={click_handler}>{value} X</button>;
  };

  useEffect(() => {
    if (sns === "" && session?.user) {
      set_sns(session.user.sns ?? "");
    }
  }, [status]);

  if (status === "loading") {
    return;
  }

  return (
    <div className="editor-container">
      <p>게시글 내용</p>
      <hr />
      <label htmlFor="title">제목 *: </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={title_change_handler}
        autoComplete="off"
      />
      <br />
      <label htmlFor="content">내용: </label>
      <input
        type="text"
        id="content"
        value={content}
        onChange={content_change_handler}
        autoComplete="off"
      />
      <br />
      <label htmlFor="sns">SNS Url: </label>
      <input
        type="text"
        id="sns"
        value={sns}
        onChange={sns_change_handler}
        autoComplete="off"
      />
      <br />
      <p>검색 필터 설정</p>
      <hr />
      {gender_category.map((i) => (
        <InputBox
          category="gender"
          name={i}
          value={gender}
          change_handler={gender_change_handler}
          key={i}
        />
      ))}
      <p>종족</p>
      {race_category.map((i) => (
        <InputBox
          category="race"
          name={i}
          value={race}
          change_handler={race_change_handler}
          key={i}
        />
      ))}
      <p>직업 (중복 선택 가능)</p>
      {job_category.map((i) => (
        <CheckBox
          category="job"
          name={i}
          value={job}
          change_handler={job_change_handler}
          key={i}
        />
      ))}
      <br />
      <label htmlFor="tag">태그: </label>
      {tag.map((tag, i) => (
        <TagBox value={tag} key={i} />
      ))}
      <input
        type="text"
        id="tag"
        autoComplete="off"
        value={tag_input}
        onChange={tag_change_handler}
      />
      <p>태그 입력 후 스페이스바로 태그 추가</p>
      <button onClick={post}>글 작성</button>
    </div>
  );
}
