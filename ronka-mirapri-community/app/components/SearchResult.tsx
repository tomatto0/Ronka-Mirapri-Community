import "../css/SearchResult.css";
import { useRef, useState, useEffect } from "react";
import { Item } from "../types/Item";

export default function SearchResult({
  slot,
  search_result,
  edit_equiped_item,
  reset_keyword,
}: {
  slot: number;
  search_result: Item[];
  edit_equiped_item: (slot: number, item: Item) => void;
  reset_keyword: () => void;
}) {
  const SearchedItem = ({
    slot,
    item,
    click_handler,
  }: {
    slot: number;
    item: Item;
    click_handler: (slot: number, item: Item) => void;
  }) => {
    const component = useRef<HTMLDivElement | null>(null);
    const click_handler_container = () => {
      click_handler(slot, item);
    };

    return (
      <div
        className="search-result"
        ref={component}
        onClick={click_handler_container}
      >
        <img
          className="item-icon"
          src={process.env.PUBLIC_URL + item.Icon}
          alt={item.Name}
        />
        <span>{item.Name}</span>
      </div>
    );
  };

  const loader = useRef<HTMLDivElement | null>(null);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const [page, set_page] = useState<number>(1);
  const [show_result, set_show_result] = useState<Item[]>(
    search_result.slice(0, 10)
  );
  const click_handler = (slot: number, item: Item) => {
    const dye_item = {
      ...item,
      DyeFirst: 0,
      DyeSecond: 0,
    };
    edit_equiped_item(slot, dye_item);
    reset_keyword();
    set_show_result([]);
  };

  useEffect(() => {
    if (search_result.length === show_result.length) {
      return;
    }
    const observer = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !is_loading) {
          set_is_loading(true);
          set_show_result(search_result.slice(0, (page + 1) * 10));
          set_page(page + 1);
          set_is_loading(false);
        }
      },
      { threshold: 0 }
    );

    const loader_current = loader.current;
    if (loader_current) {
      observer.observe(loader_current);
    }

    return () => {
      if (loader_current) {
        observer.unobserve(loader_current);
      }
    };
  }, [is_loading, page, search_result, show_result]);

  useEffect(() => {
    set_show_result(search_result.slice(0, 10));
  }, [search_result]);

  return (
    <div className="search-result-container">
      <div>
        {show_result.map((item) => (
          <SearchedItem
            key={item.Id}
            slot={slot}
            item={item}
            click_handler={click_handler}
          />
        ))}
      </div>
      <div ref={loader} className="loader">
        {is_loading && <span></span>}
      </div>
    </div>
  );
}
