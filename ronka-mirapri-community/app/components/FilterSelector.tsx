import "../css/FilterSelector.css";

import { useEffect, useState } from "react";
import {
  filter_tag_init_state,
  gender_category,
  job_category,
  job_category_group as job_category_group_raw,
  race_category,
} from "../utils/constants";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import { Item } from "../types/Item";
import ItemSearch from "./ItemSearch";
import ItemSearchResult from "./ItemSearchResult";
import UserSearch from "./UserSearch";
import UserSearchResult from "./UserSearchResult";
import ErrorContainer from "./ErrorContainer";

export default function FilterSelector({
  filter,
  set_filter,
  filter_tag,
  set_filter_tag,
  is_open,
  set_is_open,
}: {
  filter: string;
  set_filter: React.Dispatch<React.SetStateAction<string>>;
  filter_tag: {
    order: string;
    keyword: string;
    gender: string;
    race: string[];
    job: string[];
  };
  set_filter_tag: (f: typeof filter_tag_init_state) => void;
  is_open: boolean;
  set_is_open: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //키워드 세팅관련 변수 선언
  const [keyword, set_keyword] = useState<string>("");
  const [search_category, set_search_category] = useState<string>("item");
  const [item_search_result, set_item_search_result] = useState<Item[]>([]);
  const [user_search_result, set_user_search_result] = useState<string[]>([]);
  const [selected_filter_tag, set_selected_filter_tag] =
    useState<typeof filter_tag>(filter_tag);
  const { ["모든 클래스"]: _, ...job_category_group } = job_category_group_raw;
  function order_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_selected_filter_tag(prev => ({ ...prev, order: e.target.value }));
  }
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_selected_filter_tag(prev => ({ ...prev, gender: e.target.value }));
  }
  function race_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_selected_filter_tag(prev => {
      const order_map = new Map(race_category.map((item, i) => [item, i]));
      const race_list = prev.race.includes(e.target.value)
        ? prev.race.filter(i => i !== e.target.value)
        : [...prev.race, e.target.value];
      race_list.sort(
        (a, b) =>
          (order_map.get(a) ?? Infinity) - (order_map.get(b) ?? Infinity)
      );
      return { ...prev, race: race_list };
    });
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
      const new_job = selected_filter_tag.job.includes(e.target.value)
        ? selected_filter_tag.job.filter(
            i =>
              !job_category_group[e.target.value].includes(i) &&
              i !== e.target.value
          )
        : [
            ...selected_filter_tag.job,
            ...job_category_group[e.target.value].filter(
              i => !selected_filter_tag.job.includes(i)
            ),
            e.target.value,
          ];
      set_selected_filter_tag(prev => ({
        ...prev,
        job: job_groupize(new_job),
      }));
    } else {
      const new_job = selected_filter_tag.job.includes(e.target.value)
        ? selected_filter_tag.job.filter(i => i !== e.target.value)
        : [...selected_filter_tag.job, e.target.value];
      set_selected_filter_tag(prev => ({
        ...prev,
        job: job_groupize(new_job),
      }));
    }
  }

  function search(keyword: string) {
    set_selected_filter_tag(prev => ({ ...prev, keyword: keyword.trim() }));
    set_keyword("");
  }

  function update_filter() {
    set_filter_tag(selected_filter_tag);
    set_is_open(false);
  }
  function reset_filter() {
    set_filter("{}");
    set_filter_tag(filter_tag_init_state);
    set_is_open(false);
  }

  useEffect(() => {
    set_selected_filter_tag(filter_tag);
  }, [is_open]);

  if (!is_open) {
    return <div></div>;
  }
  return (
    <div
      className="filter-background"
      onClick={() => {
        set_is_open(false);
      }}
    >
      <div
        className="filter-wrap"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="filter-modal-title">
          <h3>검색 필터</h3>
          <button
            className="modal-close"
            onClick={() => {
              set_is_open(false);
            }}
          >
            <img
              src={process.env.NEXT_PUBLIC_BASE_URL + "/img/cancle.svg"}
              alt="modal close button"
            />
          </button>
        </div>

        {/* 검색섹션 - 검색창 */}
        {search_category === "item" ? (
          <ItemSearch
            keyword={keyword}
            set_keyword={set_keyword}
            set_search_result={set_item_search_result}
            keydown_handler={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                search(e.currentTarget.value);
                set_keyword("");
              }
            }}
            placeholder="검색어를 입력해주세요"
          />
        ) : (
          <UserSearch
            keyword={keyword}
            set_keyword={set_keyword}
            set_search_result={set_user_search_result}
            placeholder=""
          />
        )}

        {/* 검색섹션 - 검색결과 상단바 */}
        {keyword.trim() !== "" && (
          <div className="search-result-bar">
            <div
              className={[
                "search-result-title",
                search_category === "item" ? "search-category-active" : "",
              ].join(" ")}
              onClick={() => {
                set_search_category("item");
              }}
            >
              아이템
            </div>
            <div
              className={[
                "search-result-title",
                search_category !== "item" ? "search-category-active" : "",
              ].join(" ")}
              onClick={() => {
                set_search_category("user");
              }}
            >
              유저
            </div>
          </div>
        )}

        {/* 검색섹션 - 검색결과 리스트 */}
        {keyword.trim() !== "" &&
          (search_category === "item" ? (
            <div className="item-search-result-main">
              {item_search_result.length !== 0 && (
                <div
                  onClick={() => {
                    search(keyword);
                  }}
                  className="item-search-keyword"
                >
                  {`'${keyword}'이 포함된 룩북 전체보기`}{" "}
                </div>
              )}
              {item_search_result.length === 0 ? (
                <ErrorContainer
                  error_message="검색 결과가 없어요."
                  small={true}
                />
              ) : (
                <ItemSearchResult
                  slot={-1}
                  search_result={item_search_result}
                  result_click_handler={(slot: number, item: Item) => {
                    search(item.Name);
                  }}
                  reset_keyword={() => {
                    set_keyword("");
                  }}
                />
              )}
            </div>
          ) : (
            <div className="item-search-result-main">
              {user_search_result.length === 0 ? (
                <ErrorContainer
                  error_message="검색 결과가 없어요."
                  small={true}
                />
              ) : (
                <UserSearchResult search_result={user_search_result} />
              )}
            </div>
          ))}
        {/* 정렬 및 성별 필터 */}
        {keyword.trim() === "" && (
          <div className="filter-scroll">
            <div className="filter-top">
              <div className={`filter-layout-block align`}>
                <p className="filter-title">정렬</p>
                <div className="filter-item-align">
                  {["최신순", "인기순"].map(i => (
                    <RadioBox
                      category="order"
                      name={i}
                      value={selected_filter_tag.order}
                      change_handler={order_change_handler}
                      key={i}
                    />
                  ))}
                </div>
              </div>
              <div className={`filter-layout-block sex`}>
                <p className="filter-title">성별</p>
                <div className="filter-item-align">
                  {["전체", ...gender_category].map(i => (
                    <RadioBox
                      category="gender"
                      name={i}
                      value={selected_filter_tag.gender}
                      change_handler={gender_change_handler}
                      key={i}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 검색어 필터 */}
            {selected_filter_tag.keyword !== "" && (
              <div className="filter-layout-block">
                <p className="filter-title">검색어</p>
                <div className="filter-item-align">
                  <p
                    className="filter-item filter-item-active"
                    onClick={() => {
                      search("");
                    }}
                  >
                    {selected_filter_tag.keyword} X
                  </p>
                </div>
              </div>
            )}

            {/* 직업 필터 */}
            <div className="filter-layout-block">
              <p className="filter-title">
                직업<span className="filter-title-sub">중복선택가능</span>
              </p>
              <div className={`filter-item-align jobs`}>
                {job_category.map(i => (
                  <CheckBox
                    category="job"
                    name={i}
                    value={selected_filter_tag.job}
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
            </div>

            {/* 종족 필터 */}
            <div className="filter-layout-block">
              <p className="filter-title">
                종족<span className="filter-title-sub">중복선택가능</span>
              </p>
              <div className="filter-item-align">
                {race_category.map(i => (
                  <CheckBox
                    category="race"
                    name={i}
                    value={selected_filter_tag.race}
                    change_handler={race_change_handler}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {keyword.trim() !== "" ? (
          ""
        ) : (
          <div className="submit-button-wrap">
            <button className="filter-reset-button" onClick={reset_filter}>
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/refresh.svg"}
                alt="modal close button"
              />
              초기화
            </button>
            <button className="filter-submit-button" onClick={update_filter}>
              필터적용
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
