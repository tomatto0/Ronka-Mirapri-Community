"use client";

import "../css/editor.css";
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
      const groups = Object.keys(job_category_group);
      groups.forEach(group => {
        if (job_category_group[group].every(i => job.includes(i))) {
          if (!job.includes(group)) {
            job = [...job, group];
          }
          if (job_category_group["모든 클래스"].every(i => job.includes(i))) {
            if (!job.includes("모든 클래스")) {
              job = [...job, "모든 클래스"];
            }
          }
        } else {
          job = job.filter(i => i !== group);
        }
      });
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
    return (
      <button className="editor-tag" onClick={click_handler}>
        {value}{" "}
        <img
          src={process.env.NEXT_PUBLIC_BASE_URL + "/img/close_green.svg"}
          alt="tag_close button"
        />
      </button>
    );
  };
  //#endregion

  return (
    <div className="editor-container">
      <h3>게시글 내용</h3>
      <hr className="editor-divider" />
      <label className="editor-input-title" htmlFor="title">
        제목 *
      </label>
      <input
        type="text"
        id="title"
        value={post_data.title}
        onChange={title_change_handler}
        autoComplete="off"
      />
      <p>{message.title}</p>
      <label className="editor-input-title" htmlFor="content">
        내용{" "}
      </label>
      <textarea
        wrap="soft"
        rows={2}
        id="content"
        value={post_data.content}
        onChange={content_change_handler}
        autoComplete="off"
      />
      <p>{message.content}</p>
      <label className="editor-input-title" htmlFor="sns">
        SNS URL{" "}
      </label>
      <input
        type="text"
        id="sns"
        value={post_data.sns}
        onChange={sns_change_handler}
        autoComplete="off"
      />
      <p>{message.sns}</p>
      <h3>검색 필터 설정</h3>
      <hr className="editor-divider" />
      <h4>착용가능 성별</h4>
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
      <h4>종족 *</h4>
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
      <h4>
        직업 <span>중복 선택 가능</span>
      </h4>
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
      <div className="editor-tag-title">
        <label className="editor-input-title" htmlFor="tag">
          태그
        </label>
        <div className="editor-tag-box">
          <div className="editor-tags-wrap">
            {post_data.tag.map((tag, i) => (
              <TagBox value={tag} key={i} />
            ))}
          </div>
          <input
            className="tag-input"
            type="text"
            id="tag"
            autoComplete="off"
            value={tag_input}
            onChange={tag_change_handler}
          />
        </div>
        <p className="input_subtext">태그 입력 후 스페이스바로 태그 추가</p>
        <p>{message.tag}</p>
      </div>
    </div>
  );
}
