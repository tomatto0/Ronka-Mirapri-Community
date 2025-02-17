"use client";

import {
  gender_category,
  race_category,
  job_category,
  post_init_state,
  job_category_group,
} from "../utils/constants";
import React, { ActionDispatch, useState } from "react";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";

export default function Editor({
  post_data,
  dispatch,
  message,
}: {
  post_data: typeof post_init_state;
  dispatch: ActionDispatch<
    [
      action: {
        type: "UPDATE_FIELD";
        field: string;
        value: string | string[];
      }
    ]
  >;
  message: {
    title: string;
    content: string;
    sns: string;
    race: string;
    job: string;
    tag: string;
  };
}) {
  const [tag_input, set_tag_input] = useState<string>("");
  //#region setter
  function title_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "UPDATE_FIELD",
      field: "title",
      value: e.target.value.trimStart(),
    });
  }
  function content_change_handler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch({
      type: "UPDATE_FIELD",
      field: "content",
      value: e.target.value.trimStart(),
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
      const order_map = new Map(job_category.map((item, i) => [item, i]));
      const groups = Object.keys(job_category_group);
      groups.forEach(group => {
        if (job_category_group[group].every(i => job.includes(i))) {
          if (!job.includes(group)) {
            job = [...job, group];
          }
        } else {
          job = job.filter(i => i !== group);
        }
      });
      job.sort(
        (a, b) =>
          (order_map.get(a) ?? Infinity) - (order_map.get(b) ?? Infinity)
      );
      return job;
    }
    if (Object.keys(job_category_group).includes(e.target.value)) {
      const new_job = post_data.job.includes(e.target.value)
        ? post_data.job.filter(
            i =>
              !job_category_group[e.target.value].includes(i) &&
              i !== e.target.value
          )
        : [
            ...post_data.job,
            ...job_category_group[e.target.value].filter(
              i => !post_data.job.includes(i)
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
        ? post_data.job.filter(i => i !== e.target.value)
        : [...post_data.job.filter(i => i !== "모든 클래스"), e.target.value];
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

  //#region component
  const TagBox = ({ value }: { value: string }) => {
    const click_handler = () => {
      dispatch({
        type: "UPDATE_FIELD",
        field: "tag",
        value: post_data.tag.filter(i => i !== value),
      });
    };
    return <button onClick={click_handler}>{value} X</button>;
  };
  //#endregion

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
      <p>{message.title}</p>
      <label htmlFor="content">내용: </label>
      <textarea
        id="content"
        value={post_data.content}
        onChange={content_change_handler}
        autoComplete="off"
      />
      <p>{message.content}</p>
      <label htmlFor="sns">SNS Url: </label>
      <input
        type="text"
        id="sns"
        value={post_data.sns}
        onChange={sns_change_handler}
        autoComplete="off"
      />
      <p>{message.sns}</p>
      <p>검색 필터 설정</p>
      <hr />
      <p>성별</p>
      <div className="filter-item-align">
        {gender_category.map(i => (
          <RadioBox
            category="gender"
            name={i}
            value={post_data.gender}
            change_handler={gender_change_handler}
            key={i}
          />
        ))}
      </div>
      <p>종족</p>
      <div className="filter-item-align">
        {race_category.map(i => (
          <RadioBox
            category="race"
            name={i}
            value={post_data.race}
            change_handler={race_change_handler}
            key={i}
          />
        ))}
      </div>
      <p>{message.race}</p>
      <p>직업 (중복 선택 가능)</p>
      <div className="filter-item-align">
        {job_category.map(i => (
          <CheckBox
            category="job"
            name={i}
            value={post_data.job}
            change_handler={job_change_handler}
            className={
              i in { ...job_category_group, 제작자: "_", 채집가: "_" }
                ? "category"
                : ""
            }
            key={i}
          />
        ))}
      </div>
      <p>{message.job}</p>
      <label htmlFor="tag">태그:</label>
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
      <p>{message.tag}</p>
    </div>
  );
}
