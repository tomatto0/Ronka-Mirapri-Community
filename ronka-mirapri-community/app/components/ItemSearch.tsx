import "../css/ItemSearchModal.css";
import { useEffect, useRef } from "react";
import item_list_raw from "../json/filtered_items.json";
import equip_slot_categories from "../json/equip_slot_categories.json";
import { Item } from "../types/Item";
import { EquipSlot } from "../types/EquipSlot";
import Hangul from "hangul-js";

export default function ItemSearch({
  keyword,
  set_keyword,
  set_search_result,
  slot = -1,
  placeholder = "아이템을 검색하세요",
}: {
  keyword: string;
  set_keyword: (keyword: string) => void;
  set_search_result: (items: Item[]) => void;
  slot?: number;
  placeholder?: string;
}) {
  const item_list: Item[] = item_list_raw as Item[];
  const slot_category: { [key: number]: EquipSlot } = equip_slot_categories;
  const input_ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (input_ref.current) {
      input_ref.current.focus();
    }
  }, [input_ref]);
  useEffect(() => {
    const handler = setTimeout(search, 200);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_keyword(e.target.value);
  };
  const search = () => {
    if (keyword.trim() === "") {
      set_search_result([]);
      return false;
    }

    const searcher = new Hangul.Searcher(keyword.trim());
    const eslot = slot > 4 ? 5 : slot;

    const result = item_list.filter(
      item =>
        searcher.search(item.Name) >= 0 &&
        (slot_category[item.EquipSlotCategory]["Slot"] === eslot || slot == -1)
    );
    result.reverse();
    set_search_result(result);
  };
  return (
    <div className="item-search-container">
      <img
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
