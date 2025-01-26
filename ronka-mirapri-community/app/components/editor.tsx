import { useState } from "react";
import {
  gender_category,
  race_category,
  job_category,
} from "../utils/constants";

export default function Editor() {
  const [gender, set_gender] = useState<string>("공용");
  const [race, set_race] = useState<string | null>(null);
  const [job, set_job] = useState<string[]>(["모든 클래스"]);

  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_gender(e.target.value);
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_race(e.target.value);
  }
  function job_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    set_job(
      job.includes(e.target.value)
        ? job.filter((i) => i !== e.target.value)
        : [...job, e.target.value]
    );
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

  return (
    <div className="editor-container">
      <p>게시글 내용</p>
      <hr />
      <label htmlFor="title">제목 *: </label>
      <input type="text" id="title" />
      <br />
      <label htmlFor="content">내용: </label>
      <input type="text" id="content" />
      <br />
      <label htmlFor="sns">SNS Url: </label>
      <input type="text" id="sns" />
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
      <input type="text" id="tag" />
    </div>
  );
}
