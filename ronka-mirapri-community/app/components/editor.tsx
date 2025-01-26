import { useState } from "react";

export default function Editor() {
  const [gender, set_gender] = useState<string>("unisex");
  function gender_change_handler(e: React.ChangeEvent<HTMLInputElement>) {
    set_gender(e.target.value);
  }
  const GenderInput = ({
    name,
    value,
    gender,
    gender_change_handler,
  }: {
    name: string;
    value: string;
    gender: string;
    gender_change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return (
      <label htmlFor={`gender-${value}`}>
        <span>{name + (gender == value ? "O" : "")}</span>
        <input
          type="radio"
          id={`gender-${value}`}
          name="gender"
          value={value}
          checked={gender == value}
          onChange={gender_change_handler}
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
      <GenderInput
        name="공용"
        value="unisex"
        gender={gender}
        gender_change_handler={gender_change_handler}
      />
      <GenderInput
        name="여성"
        value="female"
        gender={gender}
        gender_change_handler={gender_change_handler}
      />
      <GenderInput
        name="남성"
        value="male"
        gender={gender}
        gender_change_handler={gender_change_handler}
      />
    </div>
  );
}
