"use client";

import "../../../css/editor.css";
import ItemSearchModal from "@/app/components/ItemSearchModal";
import Editor from "@/app/components/Editor";
import equip_slot_categories from "../../../json/equip_slot_categories.json";
import { EquipSlot } from "@/app/types/EquipSlot";
import { Item } from "@/app/types/Item";
import { useSession } from "next-auth/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { post_init_state, item_null } from "@/app/utils/constants";
import ItemInformation from "@/app/components/ItemInformation";
import Swal from "sweetalert2";
import post_validate from "@/app/utils/post_validate";
import { useRouter } from "next/navigation";
import UserCanvasViewer from "@/app/components/UserCanvasViewer";

export default function EditorPageClient({
  data,
}: {
  data: {
    author: { nickname: string; _id: string };
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
  const router = useRouter();

  const [image_src, set_image_src] = useState<string>(data.image_url);
  const [is_open, set_is_open] = useState<boolean>(false);
  const [modal_slot, set_modal_slot] = useState<number>(0);
  const [slot_active, set_slot_active] = useState<boolean[]>(
    new Array(8).fill(true)
  );
  const [equiped_item, set_equiped_item] = useState<Item[]>(data.equiped_item);
  const is_posted = useRef<boolean>(false);

  function post_reducer(
    state: typeof post_init_state,
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
  function message_reducer(
    state: typeof message_init_state,
    action: {
      type: "UPDATE_FIELD";
      field: string;
      value: any;
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
  const message_init_state = {
    title: "",
    content: "",
    sns: "",
    race: "",
    job: "",
    tag: "",
  };

  const [post_data, post_dispatch] = useReducer(post_reducer, {
    title: data.title,
    content: data.content,
    sns: data.sns,
    gender: data.gender,
    race: data.race,
    job: data.job,
    tag: data.tag,
  });
  const [message_data, message_dispatch] = useReducer(
    message_reducer,
    message_init_state
  );

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

  async function patch() {
    const { is_validate, ...post_message } = post_validate(
      image_src,
      equiped_item,
      post_data
    );
    if (!is_validate) {
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "title",
        value: post_message.title,
      });
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "content",
        value: post_message.content,
      });
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "sns",
        value: post_message.sns,
      });
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "race",
        value: post_message.race,
      });
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "job",
        value: post_message.job,
      });
      message_dispatch({
        type: "UPDATE_FIELD",
        field: "tag",
        value: post_message.tag,
      });
      if (post_message.image || post_message.item) {
        Swal.fire({
          html: [post_message.image, post_message.item].join("<br/>"),
          icon: "error",
        });
      }
      return;
    }
    try {
      post_data.title = post_data.title.trim();
      post_data.content = post_data.content.trim();
      post_data.sns = post_data.sns.trim();

      const post_response = await fetch("/api/db/posts", {
        method: "PATCH",
        body: JSON.stringify({
          id: data._id,
          equiped_item: equiped_item,
          ...post_data,
        }),
      });
      if (!post_response.ok) {
        return;
      }
      const post_res = await post_response.json();
      console.log("res", post_res);
      is_posted.current = true;
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        timer: 300000,
        showConfirmButton: false,
      });
      Toast.fire({
        icon: "success",
        text: "글 수정이 완료되었습니다.",
      });
      router.push(`/post/${post_res.data.index}`);
    } catch (e) {
      console.error(e);
    }
  }
  async function post_delete() {
    try {
      const modal = await Swal.fire({
        title: "정말로 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        reverseButtons: true,
      });
      if (modal.isConfirmed) {
        const post_response = await fetch("/api/db/posts", {
          method: "DELETE",
          body: JSON.stringify({ id: data._id }),
        });
        if (!post_response.ok) {
          return;
        }
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          timer: 3000,
          showConfirmButton: false,
        });
        Toast.fire({ icon: "success", text: "게시글 삭제가 완료되었습니다." });
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (status !== "loading" && session?.user._id !== data.author._id) {
      router.push(`/post/${data.index}`);
      Swal.fire({
        title: "작성자만 수정할 수 있습니다.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main>
        <span className="loading"></span>
      </main>
    );
  }
  if (session?.user._id === data.author._id) {
    return (
      <main>
        <div className="main-container">
          <UserCanvasViewer
            image_src={data.image_url}
            equiped_item={data.equiped_item}
          />
          <ItemInformation
            image_src={image_src}
            open_modal={open_modal}
            equiped_item={equiped_item}
            slot_active={slot_active}
            reset_equiped_item={reset_equiped_item}
          />
        </div>
        <Editor
          post_data={post_data}
          dispatch={post_dispatch}
          message={message_data}
        />
        <button onClick={patch}>수정</button>
        <button onClick={post_delete}>삭제</button>
        <ItemSearchModal
          slot={modal_slot}
          is_open={is_open}
          equiped_item={equiped_item}
          set_is_open={set_is_open}
          edit_equiped_item={edit_equiped_item}
        />
      </main>
    );
  } else {
    return <main></main>;
  }
}
