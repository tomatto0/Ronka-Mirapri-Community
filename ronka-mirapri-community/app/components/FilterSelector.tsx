import "../css/FilterSelector.css";

import { useEffect, useRef, useState } from "react";
import {
  gender_category,
  job_category,
  job_category_group as job_category_group_raw,
  race_category,
} from "../utils/constants";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FilterSelector({
  set_filter,
  order,
  set_order,
}: {
  set_filter: (filter: string) => void;
  order: string;
  set_order: (order: string) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  //키워드 세팅관련 변수 선언
  const [search_keyword, set_search_keyword] = useState<string>(
    searchParams.get("keyword") ?? ""
  );
  const [keyword, set_keyword] = useState<string>(
    searchParams.get("keyword") ?? ""
  );
  const keyword_ref = useRef<HTMLInputElement | null>(null);
  const [gender, set_gender] = useState<string>("전체");
  const [race, set_race] = useState<string[]>([]);
  const [job, set_job] = useState<string[]>([]);

  const { ["모든 클래스"]: _, ...job_category_group } = job_category_group_raw;
  function keyword_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_keyword(e.target.value.trimStart());
  }
  function order_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_order(e.target.value);
  }
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_gender(e.target.value);
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_race(prev =>
      prev.includes(e.target.value)
        ? prev.filter(i => i !== e.target.value)
        : [...prev, e.target.value]
    );
  }
  function job_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    function job_groupize(job: string[]) {
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
      return job;
    }
    if (Object.keys(job_category_group).includes(e.target.value)) {
      const new_job = job.includes(e.target.value)
        ? job.filter(
            i =>
              !job_category_group[e.target.value].includes(i) &&
              i !== e.target.value
          )
        : [
            ...job,
            ...job_category_group[e.target.value].filter(i => !job.includes(i)),
            e.target.value,
          ];
      set_job(job_groupize(new_job));
    } else {
      const new_job = job.includes(e.target.value)
        ? job.filter(i => i !== e.target.value)
        : [...job.filter(i => i !== "모든 클래스"), e.target.value];
      set_job(job_groupize(new_job));
    }
  }

  function update_params(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function search() {
    set_search_keyword(keyword.trim());
    update_params("keyword", keyword);
  }

  useEffect(() => {
    let keyword_filter = {};
    if (search_keyword !== "") {
      keyword_filter = {
        equiped_item: {
          $elemMatch: { Name: { $regex: search_keyword, $options: "i" } },
        },
      };
    }
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
        ...keyword_filter,
        ...gender_filter,
        ...race_filter,
        ...job_filter,
      })
    );
  }, [search_keyword, gender, race, job]);

  return (
    <div className="filter_wrap">
      <div className="filter_modal_title">
        <h3>검색 필터</h3>
        <button className="modal_close">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL + "/img/cancle.svg"}
            alt="modal close button"
          />
        </button>
      </div>
      <img
        className="search-icon"
        src={process.env.NEXT_PUBLIC_BASE_URL + "/img/search.svg"}
        alt="search icon"
      />
      <input
        type="text"
        ref={keyword_ref}
        value={keyword}
        onChange={keyword_change_handler}
      />
      {/* <button onClick={search}>검색</button> */}

      {/* 정렬 및 성별 필터 */}
      <div className="filter_scroll">
        <div className="filter_top">
          <div className={`filter_layout_block align`}>
            <p className="filter_title">정렬</p>
            <div className="filter_item_align">
              {["최신순", "인기순"].map(i => (
                <RadioBox
                  category="order"
                  name={i}
                  value={order}
                  change_handler={order_change_handler}
                  key={i}
                />
              ))}
            </div>
          </div>
          <div className={`filter_layout_block sex`}>
            <p className="filter_title">성별</p>
            <div className="filter_item_align">
              {gender_category.map(i => (
                <RadioBox
                  category="gender"
                  name={i}
                  value={gender}
                  change_handler={gender_change_handler}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 검색어 필터 */}
        <div className="filter_layout_block">
          <p className="filter_title">검색어</p>
          <div className="filter_item_align">
            {["최신순", "인기순"].map(i => (
              <RadioBox
                category="order"
                name={i}
                value={order}
                change_handler={order_change_handler}
                key={i}
              />
            ))}
          </div>
        </div>

        {/* 직업 필터 */}
        <div className="filter_layout_block">
          <p className="filter_title">
            직업<span className="filter_title_sub">중복선택가능</span>
          </p>
          <div className={`filter_item_align jobs`}>
            {job_category.map(i => (
              <CheckBox
                category="job"
                name={i}
                value={job}
                change_handler={job_change_handler}
                key={i}
              />
            ))}
          </div>
        </div>

        {/* 종족 필터 */}
        <div className="filter_layout_block">
          <p className="filter_title">
            종족<span className="filter_title_sub">중복선택가능</span>
          </p>
          <div className="filter_item_align">
            {race_category.map(i => (
              <CheckBox
                category="race"
                name={i}
                value={race}
                change_handler={race_change_handler}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="submit_button_wrap">
        <button className="filter_reset_button">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL + "/img/refresh.svg"}
            alt="modal close button"
          />
          초기화
        </button>
        <button className="filter_submit_button">필터적용</button>
      </div>
    </div>
  );
}
