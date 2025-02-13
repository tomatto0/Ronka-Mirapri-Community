"use client";

import "../../../css/editor.css";
import ItemSearchModal from "@/app/components/ItemSearchModal";
import UserViewer from "@/app/components/UserViewer";
import Editor from "@/app/components/Editor";
import equip_slot_categories from "../../../json/equip_slot_categories.json";
import { EquipSlot } from "@/app/types/EquipSlot";
import { Item } from "@/app/types/Item";
import { signIn, useSession } from "next-auth/react";
import { useReducer, useRef, useState } from "react";
import { editor_init_state, item_null } from "@/app/utils/constants";
import UserCanvasViewer from "@/app/components/UserCanvasViewer";

export default function EditorPageClient({
  post_data,
}: {
  post_data: {
    author: { nickname: string };
    _id: string;
    index: number;
    image_url: string;
    equiped_item: Item[];
    title: string;
    content: string;
    sns: string;
    gender: string;
    race: string;
    job: string[];
    tag: string[];
    like_count: number;
  };
}) {
  const { data: session, status } = useSession();
  const [image_src, set_image_src] = useState<string>(post_data.image_url);
  const [is_open, set_is_open] = useState<boolean>(false);
  const [modal_slot, set_modal_slot] = useState<number>(0);
  const [slot_active, set_slot_active] = useState<boolean[]>(
    new Array(8).fill(true)
  );
  const [equiped_item, set_equiped_item] = useState<Item[]>(
    post_data.equiped_item
  );
  const imageRef = useRef<HTMLCanvasElement | null>(null); // 캔버스 참조
  const x = useRef<number>(0);

  function editor_reducer(
    state: typeof editor_init_state,
    action: {
      type: "UPDATE_FIELD";
      field: string;
      value: string | string[];
    }
  ) {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        return state;
    }
  }

  const [editor_data, editor_dispatch] = useReducer(editor_reducer, {
    title: post_data.title,
    content: post_data.content,
    sns: post_data.sns,
    gender: post_data.gender,
    race: post_data.race,
    job: post_data.job,
    tag: post_data.tag,
  });

  const edit_equiped_item = (slot: number, item: Item) => {
    set_equiped_item(items => {
      const new_equiped_item = [...items];
      new_equiped_item[slot] = item;

      const slot_category: { [key: number]: EquipSlot } = equip_slot_categories;
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
  };
  const reset_equiped_item = () => {
    set_equiped_item(new Array(8).fill(item_null));
  };
  const open_modal = (slot: number) => {
    set_is_open(true);
    set_modal_slot(slot);
  };

  if (status === "loading") {
    return <main></main>;
  }
  return (
    <main>
      <div className="main-container">
        <UserCanvasViewer
          image_src={post_data.image_url}
          equiped_item={post_data.equiped_item}
        />
      </div>
      <Editor
        post_data={editor_data}
        dispatch={editor_dispatch}
        image_src={image_src}
        set_image_src={set_image_src}
        x={x}
        equiped_item={equiped_item}
        set_equiped_item={set_equiped_item}
        imageRef={imageRef}
      />
      <ItemSearchModal
        slot={modal_slot}
        is_open={is_open}
        equiped_item={equiped_item}
        set_is_open={set_is_open}
        edit_equiped_item={edit_equiped_item}
      />
    </main>
  );
}
