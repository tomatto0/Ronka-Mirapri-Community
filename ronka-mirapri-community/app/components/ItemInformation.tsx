import "../css/ItemInformation.css";
import { Item } from "../types/Item";
import { ColorInfo } from "../types/ColorInfo";
import Color_background_list_raw from "../json/color_background.json";
import { useState } from "react";
import Image from "next/image";

export default function ItemInformation({
  open_modal,
  equiped_item,
  slot_active,
  image_src,
  reset_equiped_item,
}: {
  open_modal: (slot: number) => void;
  equiped_item: Item[];
  slot_active: boolean[];
  image_src: string;
  reset_equiped_item: () => void;
}) {
  const slots = [
    "머리 방어구",
    "몸통 방어구",
    "손 방어구",
    "다리 방어구",
    "발 방어구",
    "추가 옵션",
    "추가 옵션",
    "추가 옵션",
  ];
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  const [is_jpg, set_is_jpg] = useState<boolean>(true);

  function is_null_equiped_item(equiped_item: Item[]): boolean {
    if (image_src === process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg") {
      return true;
    }
    for (let item of equiped_item) {
      if (item.Id !== 0) {
        return false;
      }
    }
    return true;
  }

  const image_download = () => {
    if (!is_null_equiped_item(equiped_item)) {
      const options: Intl.DateTimeFormatOptions = {
        month: "2-digit", // 두 자리 월
        day: "2-digit", // 두 자리 일
        hour: "2-digit", // 두 자리 시간
        minute: "2-digit", // 두 자리 분
        hour12: false, // 24시간제
        timeZone: "Asia/Seoul", // 한국 시간대
      };

      const formattedDate = new Intl.DateTimeFormat("ko-KR", options)
        .format(new Date())
        .replace(". ", "")
        .replace(". ", "")
        .replace(":", "");

      const canvas = document.querySelector(".user-canvas");
      if (canvas instanceof HTMLCanvasElement) {
        if (is_jpg) {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/jpeg");
          a.download = `RonkaMirapri ${formattedDate}.jpg`;
          a.click();
        } else {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = `RonkaMirapri ${formattedDate}.png`;
          a.click();
        }
      }
    }
  };

  const ItemSlot = ({
    slot_name,
    open_modal,
    slot,
    is_active,
    item,
  }: {
    slot_name: string;
    open_modal: (slot: number) => void;
    slot: number;
    is_active: boolean;
    item: Item;
  }) => {
    const item_search_modal_open = () => {
      if (is_active) {
        open_modal(slot);
      }
    };
    const src = is_active ? item.Icon : "/img/item_slot_inactive.svg";

    return (
      <div className="item-slot">
        <span>{slot_name}</span>
        <img
          src={process.env.NEXT_PUBLIC_BASE_URL + src}
          alt={slot_name + "아이콘"}
          onClick={item_search_modal_open}
        />
        <div className="dye-palette-container">
          {item.DyeCount > 0 && item.DyeFirst !== undefined && (
            <div
              className="dye-palette"
              style={
                item.DyeFirst === 0
                  ? {
                      backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/img/base-color.svg)`,
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundColor:
                        "#" +
                        Color_background_list[item.DyeFirst].background_color,
                    }
              }
            ></div>
          )}
          {item.DyeCount > 1 && item.DyeSecond !== undefined &&(
            <div
              className="dye-palette"
              style={
                item.DyeSecond === 0
                  ? {
                      backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/img/base-color.svg)`,
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundColor:
                        "#" +
                        Color_background_list[item.DyeSecond].background_color,
                    }
              }
            ></div>
          )}
        </div>
      </div>
    );
  };

  const set_png = () => {
    set_is_jpg(false);
  };
  const set_jpg = () => {
    set_is_jpg(true);
  };

  return (
    <div className="item-information-container">
      <div className="item-information">
        <div className="item-information-header">
          <div>
            <span>코디 정보 입력</span>
            <div className="infomation-icon">
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/help-circle.svg"}
                alt="도움말"
              />
            </div>
            <div className="information">
              <p>
                본 프로젝트는 롱카의 옷장? 서브 프로젝트로, 간단하게
                <br /> <strong>파판14의 코디 이미지를 생성</strong>하고 공유할
                수 있습니다.
              </p>
              <h3>사용방법 </h3>
              <ol>
                <li>코디 예시 이미지 추가하기(이미지 드래그 가능)</li>
                <li>원하는 아이템 추가하기</li>
                <li>이미지 다운로드 버튼 클릭!</li>
              </ol>
              <h3>주의사항</h3>
              <ul>
                <li>
                  본 이미지 생성기를 통해 생성된 이미지와 관련된 모든 활동으로
                  인해 발생하는 불미스러운 사건에 대해 롱카의 옷장?측은 이에
                  대해 책임을 지지 않습니다.
                </li>
                <li>
                  이미지 생성기를 사용하는 것으로, 해당 주의사항을 확인한 것으로
                  간주하므로 이 점에 유의하여 멋진 코디 생활을 즐기시길
                  바랍니다. 감사합니다.
                </li>
              </ul>
            </div>
          </div>
          <button onClick={reset_equiped_item}>초기화</button>
        </div>
        <hr />
        <div className="item-slot-container">
          <div className="item-slot-row">
            {[0, 1, 2, 3].map(i => (
              <ItemSlot
                slot_name={slots[i]}
                open_modal={open_modal}
                slot={i}
                is_active={slot_active[i]}
                item={equiped_item[i]}
                key={i}
              />
            ))}
          </div>
          <div className="item-slot-row">
            {[4, 5, 6, 7].map(i => (
              <ItemSlot
                slot_name={slots[i]}
                open_modal={open_modal}
                slot={i}
                is_active={slot_active[i]}
                item={equiped_item[i]}
                key={i}
              />
            ))}
          </div>
        </div>
        <p className="description">
          * 무기, 악세서리, 얼굴장식은 추가옵션으로 등록할 수 있습니다
        </p>
        <div className="download-container">
          {is_null_equiped_item(equiped_item) && (
            <img
              className="download-info"
              src={process.env.NEXT_PUBLIC_BASE_URL + "/img/download_info.svg"}
              alt="예시 이미지와 아이템 등록시 다운로드 가능"
            />
          )}
          <button
            className={
              "image-download " +
              (is_null_equiped_item(equiped_item) ? "inactive" : "")
            }
            onClick={image_download}
          >
            이미지 다운로드
          </button>
          <button
            className={"ext-selector" + (is_jpg ? "" : " inactive")}
            onClick={set_jpg}
          >
            JPG
          </button>
          <button
            className={"ext-selector" + (!is_jpg ? "" : " inactive")}
            onClick={set_png}
          >
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}
