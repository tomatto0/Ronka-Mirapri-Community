"use client";

import {
  gender_category,
  race_category,
  job_category,
  editor_init_state,
  item_null,
  job_category_group,
} from "../utils/constants";
import { useSession } from "next-auth/react";
import { Item } from "../types/Item";
import React, {
  ActionDispatch,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { LocalDB } from "../utils/localDB";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";

export default function Editor({
  post_data,
  dispatch,
  image_src,
  set_image_src,
  x,
  equiped_item,
  set_equiped_item,
  imageRef,
}: {
  post_data: typeof editor_init_state;
  dispatch: ActionDispatch<
    [
      action: {
        type: "UPDATE_FIELD";
        field: string;
        value: string | string[];
      }
    ]
  >;
  image_src: string;
  set_image_src: (image_src: string) => void;
  x: RefObject<number>;
  equiped_item: Item[];
  set_equiped_item: (equiped_item: Item[]) => void;
  imageRef: RefObject<HTMLCanvasElement | null>;
}) {
  const { data: session, status } = useSession();
  const localDB = new LocalDB("post_data", "user_image", false);
  const [tag_input, set_tag_input] = useState<string>("");
  const is_posted = useRef<boolean>(false);

  //#region setter
  function title_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "UPDATE_FIELD",
      field: "title",
      value: e.target.value.trimStart(),
    });
  }
  function content_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "UPDATE_FIELD",
      field: "content",
      value: e.target.value.trim(),
    });
  }
  function sns_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "UPDATE_FIELD",
      field: "sns",
      value: e.target.value.trim(),
    });
  }
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "UPDATE_FIELD", field: "gender", value: e.target.value });
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "UPDATE_FIELD", field: "race", value: e.target.value });
  }
  function job_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    function job_groupize(job: string[]) {
      const groups = Object.keys(job_category_group);
      groups.forEach((group) => {
        if (job_category_group[group].every((i) => job.includes(i))) {
          if (!job.includes(group)) {
            job = [...job, group];
          }
        } else {
          job = job.filter((i) => i !== group);
        }
      });
      return job;
    }
    if (Object.keys(job_category_group).includes(e.target.value)) {
      const new_job = post_data.job.includes(e.target.value)
        ? post_data.job.filter(
            (i) =>
              !job_category_group[e.target.value].includes(i) &&
              i !== e.target.value
          )
        : [
            ...post_data.job,
            ...job_category_group[e.target.value].filter(
              (i) => !post_data.job.includes(i)
            ),
            e.target.value,
          ];
      dispatch({
        type: "UPDATE_FIELD",
        field: "job",
        value: job_groupize(new_job),
      });
    } else {
      const new_job = post_data.job.includes(e.target.value)
        ? post_data.job.filter((i) => i !== e.target.value)
        : [...post_data.job.filter((i) => i !== "모든 클래스"), e.target.value];
      dispatch({
        type: "UPDATE_FIELD",
        field: "job",
        value: job_groupize(new_job),
      });
    }
  }
  function tag_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    const tag_input = e.target.value;
    if (tag_input.slice(-1) === " ") {
      if (!post_data.tag.includes(tag_input.trim())) {
        dispatch({
          type: "UPDATE_FIELD",
          field: "tag",
          value: [...post_data.tag, tag_input.trim()],
        });
      }
      set_tag_input("");
    } else {
      set_tag_input(tag_input);
    }
  }
  //#endregion

  //#region function
  //글 작성 동작
  async function post() {
    if (!imageRef.current) {
      return;
    }
    function post_validate(equiped_item: Item[]): boolean {
      if (
        image_src ===
        process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg"
      ) {
        return false;
      }
      if (post_data.title === "") {
        return false;
      }
      if (post_data.race === null) {
        return false;
      }
      for (let item of equiped_item) {
        if (item.Id !== 0) {
          return true;
        }
      }
      return false;
    }
    if (!post_validate(equiped_item)) {
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
        cropped_canvas.toBlob(
          (blob) => {
            if (blob) {
              return resolve(blob);
            }
            return reject(new Error("Blob 생성 실패"));
          },
          "image/webp",
          1.0
        );
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
          ...post_data,
        }),
      });
      if (!post_response.ok) {
        return;
      }
      const post_res = await post_response.json();
      localDB.open(1.0).then(() => {
        localDB.clear();
      });
      console.log("res", post_res);
      is_posted.current = true;
      window.location.href = `/post/${post_res.data.index}`;
    } catch (e) {
      console.error(e);
    }
  }
  //#endregion

  //#region component
  const TagBox = ({ value }: { value: string }) => {
    const click_handler = () => {
      dispatch({
        type: "UPDATE_FIELD",
        field: "tag",
        value: post_data.tag.filter((i) => i !== value),
      });
    };
    return <button onClick={click_handler}>{value} X</button>;
  };
  //#endregion

  //indexedDB에서 정보 불러오기
  useEffect(() => {
    if (post_data.sns === "" && session?.user) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "sns",
        value: session.user.sns ?? "",
      });
    }
    localDB.open(1.0).then(() => {
      localDB.get(1).then((i) => {
        if (i) {
          const item = i as {
            image: Blob;
            x: number;
            equiped_item: Item[];
            title: string;
            content: string;
            sns: string;
            gender: string;
            race: string;
            job: string[];
            tag: string[];
          };
          console.log({ item });
          if (item.image) {
            const objectURL = URL.createObjectURL(item.image);
            set_image_src(objectURL);
          }
          x.current = item.x;
          set_equiped_item(item.equiped_item ?? new Array(8).fill(item_null));

          dispatch({
            type: "UPDATE_FIELD",
            field: "title",
            value: item.title ?? "",
          });
          dispatch({
            type: "UPDATE_FIELD",
            field: "content",
            value: item.content ?? "",
          });
          dispatch({
            type: "UPDATE_FIELD",
            field: "gender",
            value: item.gender ?? "공용",
          });
          dispatch({
            type: "UPDATE_FIELD",
            field: "race",
            value: item.race ?? null,
          });
          dispatch({
            type: "UPDATE_FIELD",
            field: "job",
            value: item.job ?? [],
          });
          dispatch({
            type: "UPDATE_FIELD",
            field: "tag",
            value: item.tag ?? [],
          });
          if (item.sns) {
            dispatch({ type: "UPDATE_FIELD", field: "sns", value: item.sns });
          }
        }
      });
    });
  }, [status]);

  //indexedDB에 정보 저장하기
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (is_posted.current) {
        return;
      }
      localDB.open(1.0).then(() => {
        localDB.put(
          {
            x: x.current,
            equiped_item,
            ...post_data,
          },
          1
        );
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [x.current, equiped_item, post_data, is_posted.current]);

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
        value={post_data.title}
        onChange={title_change_handler}
        autoComplete="off"
      />
      <br />
      <label htmlFor="content">내용: </label>
      <input
        type="text"
        id="content"
        value={post_data.content}
        onChange={content_change_handler}
        autoComplete="off"
      />
      <br />
      <label htmlFor="sns">SNS Url: </label>
      <input
        type="text"
        id="sns"
        value={post_data.sns}
        onChange={sns_change_handler}
        autoComplete="off"
      />
      <br />
      <p>검색 필터 설정</p>
      <hr />
      {gender_category.map((i) => (
        <RadioBox
          category="gender"
          name={i}
          value={post_data.gender}
          change_handler={gender_change_handler}
          key={i}
        />
      ))}
      <p>종족</p>
      {race_category.map((i) => (
        <RadioBox
          category="race"
          name={i}
          value={post_data.race}
          change_handler={race_change_handler}
          key={i}
        />
      ))}
      <p>직업 (중복 선택 가능)</p>
      {job_category.map((i) => (
        <CheckBox
          category="job"
          name={i}
          value={post_data.job}
          change_handler={job_change_handler}
          key={i}
        />
      ))}
      <br />
      <label htmlFor="tag">태그: ??</label>
      {post_data.tag.map((tag, i) => (
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
