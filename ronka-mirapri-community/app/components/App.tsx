import "../css/App.css";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Item } from "../types/Item";
import { EquipSlot } from "../types/EquipSlot";
import equip_slot_categories from "../json/equip_slot_categories.json";
import UserCanvas from "../components/UserCanvas.tsx";
import ItemInformation from "../components/ItemInformation.tsx";
import ItemSearchModal from "../components/ItemSearchModal.tsx";

function App() {
  const image_thumbnail = () => {
    if (document.documentElement.clientWidth >= 1024) {
      return process.env.PUBLIC_URL + "/img/thumbnail.svg";
    } else {
      return process.env.PUBLIC_URL + "/img/thumbnail.svg";
    }
  };
  const [image_src, set_image_src] = useState<string>(image_thumbnail());
  const [is_open, set_is_open] = useState<boolean>(false);
  const [modal_slot, set_modal_slot] = useState<number>(0);
  const [slot_active, set_slot_active] = useState<boolean[]>(
    new Array(8).fill(true)
  );

  const item_null = useMemo(() => {
    return {
      Id: 0,
      Name: "",
      Icon: "/img/item_slot.svg",
      EquipSlotCategory: 6,
      ClassJobCategory: 0,
      DyeCount: 0,
      DyeFirst: 0,
      DyeSecond: 0,
    };
  }, []);

  const [equiped_item, set_equiped_item] = useState<Item[]>(
    new Array(8).fill(item_null)
  );

  const edit_equiped_item = useCallback(
    (slot: number, item: Item) => {
      set_equiped_item((items) => {
        const new_equiped_item = [...items];
        new_equiped_item[slot] = item;

        const slot_category: { [key: number]: EquipSlot } =
          equip_slot_categories;
        const new_slot_active = new Array(8).fill(true);

        for (let item of new_equiped_item) {
          const eslot = slot_category[item.EquipSlotCategory];
          if (eslot.Head === -1) {
            new_equiped_item[0] = item_null;
            new_slot_active[0] = false;
          }
          if (eslot.Body === -1) {
            new_equiped_item[1] = item_null;
            new_slot_active[1] = false;
          }
          if (eslot.Gloves === -1) {
            new_equiped_item[2] = item_null;
            new_slot_active[2] = false;
          }
          if (eslot.Legs === -1) {
            new_equiped_item[3] = item_null;
            new_slot_active[3] = false;
          }
          if (eslot.Feet === -1) {
            new_equiped_item[4] = item_null;
            new_slot_active[4] = false;
          }
        }
        set_slot_active(new_slot_active);
        return new_equiped_item;
      });
    },
    [item_null]
  );

  const reset_equiped_item = useCallback(() => {
    set_equiped_item(new Array(8).fill(item_null));
  }, [item_null]);

  const open_modal = useCallback((slot: number) => {
    set_is_open(true);
    set_modal_slot(slot);
  }, []);

  useEffect(() => {
    const resize_handler = () => {
      if (
        image_src === "./img/thumbnail.svg" ||
        image_src === "./img/thumbnail_mobile.svg"
      ) {
        set_image_src(image_thumbnail());
      }
    };
    window.addEventListener("resize", resize_handler);
    return () => {
      window.removeEventListener("resize", resize_handler);
    };
  }, [image_src]);

  return (
    <div className="App">
      <div className="header">
        <img alt="FFXIV-KOR MIRAPRI GENERATOR" id="title" />
      </div>
      <div className="main-container">
        <UserCanvas
          image_src={image_src}
          equiped_item={equiped_item}
          set_image_src={set_image_src}
          image_thumbnail={image_thumbnail}
        />
        <ItemInformation
          image_src={image_src}
          open_modal={open_modal}
          equiped_item={equiped_item}
          slot_active={slot_active}
          reset_equiped_item={reset_equiped_item}
        />
      </div>
      <div className="footer">
        <a href="https://ronkacloset.com">https://ronkacloset.com</a>
        <br />
        <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
      </div>
      <ItemSearchModal
        slot={modal_slot}
        is_open={is_open}
        equiped_item={equiped_item}
        set_is_open={set_is_open}
        edit_equiped_item={edit_equiped_item}
      />
    </div>
  );
}

export default App;
