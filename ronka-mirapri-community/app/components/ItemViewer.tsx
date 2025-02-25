import "../css/ItemViewer.css";
import { Item } from "../types/Item";
import Color_background_list_raw from "../json/color_background.json";
import { ColorInfo } from "../types/ColorInfo";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import Image from "next/image";

export default function ItemViewer({ equiped_item }: { equiped_item: Item[] }) {
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  const [active_modal, set_active_modal] = useState<number>(-1);

  //#region component
  const ItemSearcher = ({
    item,
    active_modal,
    set_active_modal,
    modal_key,
  }: {
    item: Item;
    active_modal: number;
    set_active_modal: React.Dispatch<SetStateAction<number>>;
    modal_key: number;
  }) => {
    const colorInfo1 = Color_background_list.find(
      color => color.color_id === item.DyeFirst
    );
    const colorInfo2 = Color_background_list.find(
      color => color.color_id === item.DyeSecond
    );
    const modal_toggle = () => {
      set_active_modal(prev => (prev === modal_key ? -1 : modal_key));
    };
    return (
      <div className="item-searcher">
        <img className="item-image" src={item.Icon} alt={item.Name} />
        <div className="post-item-information">
          <p>{item.Name}</p>
          <div className="item-color-information">
            {item.DyeFirst !== 0 && (
              <span
                style={{
                  backgroundColor: `#${colorInfo1?.background_color}`,
                  color: `${colorInfo1?.text_color}`,
                }}
              >
                1-{colorInfo1?.name}
              </span>
            )}
            {item.DyeSecond !== 0 && (
              <span
                style={{
                  backgroundColor: `#${colorInfo2?.background_color}`,
                  color: `${colorInfo2?.text_color}`,
                }}
              >
                2-{colorInfo2?.name}
              </span>
            )}
          </div>
        </div>
        <button className="search-button" onClick={modal_toggle}>
          <img alt="search icon" id="search" />
        </button>
        <SearchModal item={item} is_active={active_modal === modal_key} />
      </div>
    );
  };

  const SearchModal = ({
    item,
    is_active,
  }: {
    item: Item;
    is_active: boolean;
  }) => {
    return (
      <div className={`post-search-modal ${is_active ? "modal-active" : ""}`}>
        <Link
          href={`https://guide.ff14.co.kr/lodestone/search?keyword=${item.Name}`}
          target="_blank"
        >
          공식 가이드
        </Link>
        <Link
          href={`https://ronkacloset.com/search?type=&keyword=${item.Name}`}
          target="_blank"
        >
          롱카의 옷장
        </Link>
        <Link href={`http://localhost:3000/?keyword=${item.Name}`}>
          다른 코디 보기
        </Link>
      </div>
    );
  };
  //#endregion

  return (
    <div className="item-viewer">
      <p className="item-viewer-title">코디 아이템</p>
      <div className="item-searcher-list">
        {equiped_item.map(
          (i, key) =>
            i.Id !== 0 && (
              <ItemSearcher
                item={i}
                active_modal={active_modal}
                set_active_modal={set_active_modal}
                modal_key={key}
                key={key}
              />
            )
        )}
      </div>
    </div>
  );
}
