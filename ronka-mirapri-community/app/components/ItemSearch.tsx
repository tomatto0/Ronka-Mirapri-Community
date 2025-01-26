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
  slot,
  set_search_result,
  set_is_item_select,
}: {
  keyword: string;
  set_keyword: (keyword: string) => void;
  slot: number;
  set_search_result: (items: Item[]) => void;
  set_is_item_select: (is: boolean) => void;
}) {
  const item_list: Item[] = item_list_raw as Item[];

  const slot_category: { [key: number]: EquipSlot } = equip_slot_categories;
  const input_ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (input_ref.current) {
      input_ref.current.focus();
    }
  }, [input_ref]);
  const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input_keyword = e.target.value.trim();
    set_keyword(e.target.value);
    const searcher = new Hangul.Searcher(input_keyword);
    const eslot = slot > 4 ? 5 : slot;

    if (input_keyword === "" || input_keyword === " ") {
      set_search_result([]);
      return false;
    }
    set_is_item_select(false);
    const result = item_list.filter(
      (item) =>
        searcher.search(item.Name) >= 0 &&
        slot_category[item.EquipSlotCategory]["Slot"] === eslot
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
        placeholder="아이템을 검색하세요"
        value={keyword}
        onChange={keyword_update}
        ref={input_ref}
      />
    </div>
  );
}
