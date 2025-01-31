"use client";

import "../../css/editor.css";
import ItemInformation from "@/app/components/ItemInformation";
import ItemSearchModal from "@/app/components/ItemSearchModal";
import UserCanvas from "@/app/components/UserCanvas";
import Editor from "@/app/components/Editor";
import equip_slot_categories from "../../json/equip_slot_categories.json";
import { EquipSlot } from "@/app/types/EquipSlot";
import { Item } from "@/app/types/Item";
import { signIn, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { item_null } from "@/app/utils/constants";
import { LocalDB } from "@/app/utils/localDB";

export default function editor() {
  const { data: session, status } = useSession();
  const localDB = new LocalDB("post_data", "user_image", false);

  function sign_in_handler() {
    sessionStorage.setItem("login_callback", "/editor");
    signIn("google", { callbackUrl: "/signup" });
  }
  const [image_src, set_image_src] = useState<string>(
    process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg"
  );
  const [is_open, set_is_open] = useState<boolean>(false);
  const [modal_slot, set_modal_slot] = useState<number>(0);
  const [slot_active, set_slot_active] = useState<boolean[]>(
    new Array(8).fill(true)
  );
  const [equiped_item, set_equiped_item] = useState<Item[]>(
    new Array(8).fill(item_null)
  );
  const imageRef = useRef<HTMLCanvasElement | null>(null); // 캔버스 참조
  const x = useRef<number>(0);

  const edit_equiped_item = (slot: number, item: Item) => {
    set_equiped_item((items) => {
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
    return;
  }
  return (
    <div>
      <div className="main-container">
        <UserCanvas
          image_src={image_src}
          equiped_item={equiped_item}
          set_image_src={set_image_src}
          x={x}
          imageRef={imageRef}
        />
        <ItemInformation
          image_src={image_src}
          open_modal={open_modal}
          equiped_item={equiped_item}
          slot_active={slot_active}
          reset_equiped_item={reset_equiped_item}
        />
      </div>
      {session?.user?.login ? (
        <Editor
          image_src={image_src}
          set_image_src={set_image_src}
          x={x}
          equiped_item={equiped_item}
          set_equiped_item={set_equiped_item}
          imageRef={imageRef}
        />
      ) : (
        <div>
          <p>You are not signed in</p>
          <button onClick={sign_in_handler}>Sign in with Google</button>
        </div>
      )}
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
