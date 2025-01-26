"use client";

import "../../css/mirapri.css";
import ItemInformation from "@/app/components/ItemInformation";
import ItemSearchModal from "@/app/components/ItemSearchModal";
import UserCanvas from "@/app/components/UserCanvas";
import equip_slot_categories from "../../json/equip_slot_categories.json";
import { EquipSlot } from "@/app/types/EquipSlot";
import { Item } from "@/app/types/Item";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "@/app/components/editor";

export default function editor() {
  const { data: session, status } = useSession();

  function sign_in_handler() {
    sessionStorage.setItem("login_callback", "/editor");
    signIn("google", { callbackUrl: "/signup" });
  }
  const image_thumbnail = () => {
    return process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg";
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

  if (status === "loading") {
    return;
  }
  if (!session?.user?.login) {
    return (
      <div>
        <p>You are not signed in</p>
        <button onClick={sign_in_handler}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div>
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
      <Editor />
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
