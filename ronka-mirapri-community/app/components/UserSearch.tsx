import "../css/ItemSearchModal.css";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function UserSearch({
  keyword,
  set_keyword,
  set_search_result,
  placeholder = "유저를 검색하세요",
}: {
  keyword: string;
  set_keyword: (keyword: string) => void;
  set_search_result: (items: string[]) => void;
  placeholder?: string;
}) {
  const input_ref = useRef<HTMLInputElement | null>(null);
  const user_list = useQuery({
    queryKey: ["userlist", keyword],
    queryFn: async () => {
      if (keyword.trim() === "") {
        return [];
      }
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/db/users/list?keyword=${keyword.trim()}`
      );
      const res = await response.json();
      if (!res.success) {
        return [];
      }
      return res.data.map((user: { nickname: string }) => user.nickname);
    },
    enabled: false,
    placeholderData: [],
  });

  useEffect(() => {
    if (input_ref.current) {
      input_ref.current.focus();
    }
  }, [input_ref]);

  useEffect(() => {
    const handler = setTimeout(user_list.refetch, 200);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_keyword(e.target.value.trimStart());
  };

  useEffect(() => {
    set_search_result(user_list.data);
  }, [user_list.data]);

  return (
    <div className="item-search-container">
      <Image
        className="search-icon"
        src={process.env.NEXT_PUBLIC_BASE_URL + "/img/search.svg"}
        alt="search icon"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={keyword}
        onChange={keyword_update}
        ref={input_ref}
      />
    </div>
  );
}
