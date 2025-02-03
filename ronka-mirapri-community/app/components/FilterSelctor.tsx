import { useEffect, useState } from "react";
import {
  gender_category,
  job_category,
  job_category_group as job_category_group_raw,
  race_category,
} from "../utils/constants";

export default function FilterSelector({
  set_filter,
  order,
  set_order,
}: {
  set_filter: (filter: string) => void;
  order: string;
  set_order: (order: string) => void;
}) {
  const [gender, set_gender] = useState<string>("전체");
  const [race, set_race] = useState<string[]>([]);
  const [job, set_job] = useState<string[]>([]);

  const { ["모든 클래스"]: _, ...job_category_group } = job_category_group_raw;

  function order_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_order(e.target.value);
  }
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_gender(e.target.value);
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_race((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((i) => i !== e.target.value)
        : [...prev, e.target.value]
    );
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
      const new_job = job.includes(e.target.value)
        ? job.filter(
            (i) =>
              !job_category_group[e.target.value].includes(i) &&
              i !== e.target.value
          )
        : [
            ...job,
            ...job_category_group[e.target.value].filter(
              (i) => !job.includes(i)
            ),
            e.target.value,
          ];
      set_job(job_groupize(new_job));
    } else {
      const new_job = job.includes(e.target.value)
        ? job.filter((i) => i !== e.target.value)
        : [...job.filter((i) => i !== "모든 클래스"), e.target.value];
      set_job(job_groupize(new_job));
    }
  }

  const RadioBox = ({
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

  useEffect(() => {
    let gender_filter = {};
    if (gender !== "전체") {
      gender_filter = { gender: gender };
    }
    let race_filter = {};
    if (race.length > 0) {
      race_filter = { race: { $in: race } };
    }
    let job_filter = {};
    if (job.length > 0) {
      job_filter = { job: { $in: job } };
    }
    set_filter(
      JSON.stringify({
        ...gender_filter,
        ...race_filter,
        ...job_filter,
      })
    );
  }, [gender, race, job]);

  return (
    <div>
      <p>정렬</p>
      {["최신순", "인기순"].map((i) => (
        <RadioBox
          category="order"
          name={i}
          value={order}
          change_handler={order_change_handler}
          key={i}
        />
      ))}
      <p>성별</p>
      {gender_category.map((i) => (
        <RadioBox
          category="gender"
          name={i}
          value={gender}
          change_handler={gender_change_handler}
          key={i}
        />
      ))}
      <p>종족 (중복 선택 가능)</p>
      {race_category.map((i) => (
        <CheckBox
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
    </div>
  );
}
