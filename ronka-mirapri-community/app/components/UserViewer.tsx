import { Item } from "../types/Item";
import Color_background_list_raw from "../json/color_background.json";
import { ColorInfo } from "../types/ColorInfo";
import Link from "next/link";

export default function userViewer({ equiped_item }: { equiped_item: Item[] }) {
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];

  //#region component
  const ItemViewer = ({ item }: { item: Item }) => {
    const colorInfo1 = Color_background_list.find(
      (color) => color.color_id === item.DyeFirst
    );
    const colorInfo2 = Color_background_list.find(
      (color) => color.color_id === item.DyeSecond
    );
    return (
      <div>
        <img src={item.Icon} alt={item.Name} />
        <span>{item.Name}</span>
        {item.DyeFirst !== 0 && <span>{colorInfo1?.name}</span>}
        {item.DyeSecond !== 0 && <span>{colorInfo2?.name}</span>}
        <SearchModal item={item} />
      </div>
    );
  };

  const SearchModal = ({ item }: { item: Item }) => {
    return (
      <div>
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
        <Link
          href={`http://localhost:3000/?keyword=${item.Name}`}
          target="_blank"
        >
          다른 코디 보기
        </Link>
      </div>
    );
  };
  //#endregion

  return (
    <div>
      {equiped_item.map(
        (i, key) => i.Id !== 0 && <ItemViewer item={i} key={key} />
      )}
    </div>
  );
}
