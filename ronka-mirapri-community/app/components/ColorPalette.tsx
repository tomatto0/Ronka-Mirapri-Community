import "../css/ColorPalette.css";
import { ColorInfo } from "../types/ColorInfo";
import Color_background_list_raw from "../json/color_background.json";
import { useRef, useState, useEffect } from "react";
import { Item } from "../types/Item";

export default function ColorPalette({
  item,
  slot,
  edit_equiped_item,
  modal_close,
}: {
  item: Item;
  slot: number;
  edit_equiped_item: (slot: number, item: Item) => void;
  modal_close: () => void;
}) {
  const item_null = {
    Id: 0,
    Name: "",
    Icon: "/img/item_slot.svg",
    EquipSlotCategory: 6,
    ClassJobCategory: 0,
    DyeCount: 0,
    DyeFirst: 0,
    DyeSecond: 0,
  };
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  const itemRef = useRef<Item>(item);
  useEffect(() => {
    itemRef.current = { ...item };
  }, [item]);

  const [is_f_open, set_is_f_open] = useState<boolean>(false);
  const [is_s_open, set_is_s_open] = useState<boolean>(false);

  function palette_f_controll(is_open: boolean | undefined) {
    if (is_open === undefined) {
      set_is_f_open(!is_f_open);
      set_is_s_open(false);
    } else {
      set_is_f_open(is_open);
      set_is_s_open(false);
    }
  }
  function palette_s_controll(is_open: boolean | undefined) {
    if (is_open === undefined) {
      set_is_s_open(!is_s_open);
      set_is_f_open(false);
    } else {
      set_is_s_open(is_open);
      set_is_f_open(false);
    }
  }
  function item_cancle() {
    edit_equiped_item(slot, item_null);
  }

  const ColorPaletteRow = ({
    color,
    is_open,
    is_facewear,
    dye_slot,
    palette_controll,
  }: {
    color: number;
    is_open: boolean;
    is_facewear: boolean;
    dye_slot: number;
    palette_controll: (is_open: boolean | undefined) => void;
  }) => {
    const [color_id, set_color_id] = useState<number>(color);

    function color_id_to_category(color_id: number): number {
      if (color_id <= 6) {
        return 0;
      } else if (color_id <= 17) {
        return 1;
      } else if (color_id <= 35) {
        return 2;
      } else if (color_id <= 46) {
        return 3;
      } else if (color_id <= 63) {
        return 4;
      } else if (color_id <= 82) {
        return 5;
      } else if (color_id <= 91) {
        return 6;
      } else if (color_id <= 114) {
        return 7;
      }
      return 8;
    }

    const [color_category, set_color_category] = useState<number>(
      is_facewear ? 8 : color_id_to_category(color)
    );

    const color_cancle = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (dye_slot === 1) {
        itemRef.current.DyeFirst = 0;
      } else {
        itemRef.current.DyeSecond = 0;
      }
      edit_equiped_item(slot, itemRef.current);
      palette_controll(false);
    };

    const ColorPaletteModal = ({
      color_id,
      set_color_id,
      color_category,
      set_color_category,
      slot,
      palette_controll,
      is_facewear,
    }: {
      color_id: number;
      set_color_id: (color_id: number) => void;
      color_category: number;
      set_color_category: (category: number) => void;
      slot: number;
      palette_controll: (is_open: boolean | undefined) => void;
      is_facewear: boolean;
    }) => {
      const color_categories = [
        "white",
        "red",
        "brown",
        "yellow",
        "green",
        "blue",
        "purple",
        "rare",
      ];
      const colors = [
        Color_background_list.slice(0, 7),
        Color_background_list.slice(7, 18),
        Color_background_list.slice(18, 36),
        Color_background_list.slice(36, 47),
        Color_background_list.slice(47, 64),
        Color_background_list.slice(64, 83),
        Color_background_list.slice(83, 92),
        Color_background_list.slice(92, 115),
        [Color_background_list[0], ...Color_background_list.slice(115, 126)],
      ];

      const commit = () => {
        if (dye_slot === 1) {
          itemRef.current.DyeFirst = color_id;
        } else {
          itemRef.current.DyeSecond = color_id;
        }
        edit_equiped_item(slot, itemRef.current);
        palette_controll(false);
      };

      const cancle = () => {
        palette_controll(false);
      };

      const ColorCategory = ({
        category,
        selected_category,
        color,
        set_color_category,
      }: {
        category: number;
        selected_category: number;
        color: string;
        set_color_category: (color_category: number) => void;
      }) => {
        const click_handler = () => {
          set_color_category(category);
        };
        return (
          <div
            className={
              "color-category " +
              color +
              (selected_category === category ? " selected" : "")
            }
            onClick={click_handler}
          />
        );
      };
      const Color = ({
        colorInfo,
        color_id,
        set_color_id,
      }: {
        colorInfo: ColorInfo;
        color_id: number;
        set_color_id: (color: number) => void;
      }) => {
        const style =
          colorInfo.color_id === 0
            ? {
                backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/img/base_color.svg)`,
                backgroundPosition: "center",
              }
            : { backgroundColor: "#" + colorInfo.background_color };

        const click_handler = () => {
          set_color_id(colorInfo.color_id);
        };

        return (
          <div
            className={
              "color-category" +
              (colorInfo.color_id === 0 ? " base-color" : "") +
              (colorInfo.color_id === color_id ? " selected" : "")
            }
            style={style}
            onClick={click_handler}
          />
        );
      };

      return (
        <div className="color-palette-modal">
          {!is_facewear && (
            <div className="color-category-container">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ColorCategory
                  category={i}
                  color={color_categories[i]}
                  selected_category={color_category}
                  set_color_category={set_color_category}
                  key={i}
                />
              ))}
            </div>
          )}
          {!is_facewear && <hr className="color-palette-divider" />}
          <div className="color-category-detail">
            <p>{Color_background_list[color_id].name}</p>
            <div className="color-category-container">
              {colors[color_category].map((colorInfo) => (
                <Color
                  colorInfo={colorInfo}
                  color_id={color_id}
                  set_color_id={set_color_id}
                  key={colorInfo.color_id}
                />
              ))}
            </div>
          </div>
          <div className="color-select-button-wrap">
            <button className="color-select-submit dismiss" onClick={cancle}>
              취소
            </button>
            <button className="color-select-submit" onClick={commit}>
              색상 선택
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="palette-container">
        {color_id === 0 && (
          <div
            className="palette-name"
            onClick={() => palette_controll(undefined)}
          >
            <div className="palette-name-info">
              <img
                className="svg-image"
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/color_plus.svg"}
                alt="add_color_icon"
              />
              {dye_slot}염색 색상추가
            </div>
          </div>
        )}
        {color_id !== 0 && (
          <div
            className="palette-name"
            onClick={() => palette_controll(undefined)}
          >
            <div className="palette-name-info">
              <div
                className="palette-name-color"
                style={{
                  backgroundColor:
                    "#" + Color_background_list[color_id].background_color,
                }}
              ></div>
              {dye_slot}염색 - {Color_background_list[color_id].name}
            </div>
            <button className="image" onClick={color_cancle}>
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/cancle_small.svg"}
                alt="color cancle button"
              />
            </button>
          </div>
        )}

        {is_open && (
          <ColorPaletteModal
            color_id={color_id}
            set_color_id={set_color_id}
            color_category={color_category}
            set_color_category={set_color_category}
            slot={slot}
            palette_controll={palette_controll}
            is_facewear={is_facewear}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <p className="selected-item-title">선택된 아이템</p>
      <div className="selected-item-name">
        {item.Name}
        <button className="image" onClick={item_cancle}>
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL + "/img/cancle_small.svg"}
            alt="item cancle button"
          />
        </button>
      </div>

      {item.DyeCount >= 1 && (
        <ColorPaletteRow
          color={item.DyeFirst}
          is_open={is_f_open}
          is_facewear={itemRef.current.EquipSlotCategory === 24}
          palette_controll={palette_f_controll}
          dye_slot={1}
        />
      )}
      {item.DyeCount >= 2 && (
        <ColorPaletteRow
          color={item.DyeSecond}
          is_open={is_s_open}
          is_facewear={itemRef.current.EquipSlotCategory === 24}
          palette_controll={palette_s_controll}
          dye_slot={2}
        />
      )}

      <button className="item-submit-button" onClick={modal_close}>
        저장하기
      </button>
    </div>
  );
}
