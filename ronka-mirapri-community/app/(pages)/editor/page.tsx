"use client";

import "../../css/editor.css";
import ItemInformation from "@/app/components/ItemInformation";
import ItemSearchModal from "@/app/components/ItemSearchModal";
import Editor from "@/app/components/Editor";
import UserCanvas from "@/app/components/UserCanvas";
import equip_slot_categories from "../../json/equip_slot_categories.json";
import { EquipSlot } from "@/app/types/EquipSlot";
import { Item } from "@/app/types/Item";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { post_init_state, item_null } from "@/app/utils/constants";
import { LocalDB } from "@/app/utils/localDB";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import post_validate from "@/app/utils/post_validate";

export default function Page_editor() {
  const localDB = new LocalDB("post_data", "user_image", false);
  const { data: session, status } = useSession();
  const router = useRouter();

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
  const is_posted = useRef<boolean>(false);

  function post_reducer(
    state: typeof post_init_state,
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

  const [post_data, post_dispatch] = useReducer(post_reducer, post_init_state);
  const [message_data, message_dispatch] = useReducer(
    message_reducer,
    message_init_state
  );

  const sign_in_handler = () => {
    sessionStorage.setItem("login_callback", "/editor");
    signIn("google", { callbackUrl: "/signup" });
  };
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

  //indexedDB에서 정보 불러오기
  useEffect(() => {
    if (post_data.sns === "" && session?.user) {
      post_dispatch({
        type: "UPDATE_FIELD",
        field: "sns",
        value: session.user.sns ?? "",
      });
    }
    localDB.open(1.0).then(() => {
      localDB.get(1).then(i => {
        if (i) {
          const item = i as {
            image: Blob;
            x: number;
            equiped_item: Item[];
            title: string;
            content: string;
            sns: string;
            gender: string;
            race: string | null;
            job: string[];
            tag: string[];
          };
          console.log({ item });
          if (item.image) {
            const objectURL = URL.createObjectURL(item.image);
            set_image_src(objectURL);
          }
          x.current = item.x;
          set_equiped_item(item.equiped_item ?? new Array(8).fill(item_null));
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "title",
            value: item.title ?? "",
          });
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "content",
            value: item.content ?? "",
          });
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "gender",
            value: item.gender ?? "공용",
          });
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "race",
            value: item.race ?? null,
          });
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "job",
            value: item.job ?? [],
          });
          post_dispatch({
            type: "UPDATE_FIELD",
            field: "tag",
            value: item.tag ?? [],
          });
          if (item.sns) {
            post_dispatch({
              type: "UPDATE_FIELD",
              field: "sns",
              value: item.sns,
            });
          }
        }
      });
    });
  }, [status]);

  //indexedDB에 정보 저장하기
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (is_posted.current) {
        return;
      }
      localDB.open(1.0).then(() => {
        localDB.put(
          {
            x: x.current,
            equiped_item,
            ...post_data,
          },
          1
        );
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [x.current, equiped_item, post_data, is_posted.current]);

  async function post() {
    if (!imageRef.current) {
      return;
    }
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
      const ctx = imageRef.current.getContext("2d");
      if (!ctx) {
        throw new Error("canvas context 생성에 실패했습니다.");
      }
      const image_data = ctx.getImageData(0, 0, 540, 1080);
      const cropped_canvas = document.createElement("canvas");
      cropped_canvas.width = 540;
      cropped_canvas.height = 1080;
      const cropped_ctx = cropped_canvas.getContext("2d");
      if (!cropped_ctx) {
        throw new Error("canvas context 생성에 실패했습니다.");
      }
      cropped_ctx.putImageData(image_data, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => {
        cropped_canvas.toBlob(
          blob => {
            if (blob) {
              return resolve(blob);
            }
            return reject(new Error("Blob 생성 실패"));
          },
          "image/webp",
          1.0
        );
      });
      const form = new FormData();
      form.append("image", blob);
      const img_response = await fetch("/api/image", {
        method: "POST",
        body: form,
      });
      if (!img_response.ok) {
        return;
      }
      const img_res = await img_response.json();
      console.log(img_res);
      const image_url = img_res.image_url;
      const post_response = await fetch("/api/db/posts", {
        method: "POST",
        body: JSON.stringify({
          image_url: image_url,
          equiped_item: equiped_item,
          ...post_data,
        }),
      });
      if (!post_response.ok) {
        return;
      }
      const post_res = await post_response.json();
      localDB.open(1.0).then(() => {
        localDB.clear();
      });
      console.log("res", post_res);
      is_posted.current = true;
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        timer: 3000,
        showConfirmButton: false,
      });
      Toast.fire({ icon: "success", title: "글 작성이 완료되었습니다." });
      router.push(`/post/${post_res.data.index}`);
    } catch (e) {
      console.error(e);
    }
  }

  if (status === "loading") {
    return <main></main>;
  }
  return (
    <main>
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
          post_data={post_data}
          dispatch={post_dispatch}
          message={message_data}
        />
      ) : (
        <div className="write_button_wrap">
          <button className="login_to_write_button" onClick={sign_in_handler}>
            LOGIN
          </button>
          <p>로그인시 글작성 가능</p>
        </div>
      )}
      <button className="editor-submit-button" onClick={post}>
        작성
      </button>
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
