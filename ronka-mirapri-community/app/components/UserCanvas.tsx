"use client";

import { useRef, useState, useEffect, useCallback, RefObject } from "react";
import { ColorInfo } from "../types/ColorInfo";
import Color_background_list_raw from "../json/color_background.json";
import { Item } from "../types/Item";
import "../css/UserCanvas.css";
import { LocalDB } from "../utils/localDB";

type ItemImage = {
  Id: number;
  Image: HTMLImageElement;
};

// 마우스와 터치 범위 설정시 사용하는 값을 최소와 최대 범위로 제한하는 함수
function clamp(min: number, val: number, max: number) {
  min = min > max ? max : min;
  return val < min ? min : val > max ? max : val;
}

export default function UserCanvas({
  image_src,
  equiped_item,
  set_image_src,
  imageRef,
  x,
}: {
  image_src: string;
  equiped_item: Item[];
  set_image_src: (image_src: string) => void;
  x: RefObject<number>;
  imageRef: RefObject<HTMLCanvasElement | null>;
}) {
  const user_image = useRef<HTMLImageElement | null>(null); // 사용자 이미지 Ref
  const item_background_image = useRef<HTMLImageElement | null>(null); //아이템 배경 이미지 Ref
  const item_placeholder_image = useRef<HTMLImageElement | null>(null); //아이템 플레이스홀더 이미지 Ref
  useEffect(() => {
    user_image.current = new Image();
    item_background_image.current = new Image();
    item_placeholder_image.current = new Image();
  }, []);
  const is_user_image_loaded = useRef<boolean>(false);
  const is_image_loaded = useRef<boolean>(false); //아이템 배경, 플레이스 홀더 로드 완료 여부
  const isDown = useRef<boolean>(false); // 마우스 클릭 여부 확인
  const startX = useRef<number>(0); // 마우스 시작 X좌표
  // const startY = useRef<number>(0);
  // const x = useRef<number>(0); // 이미지의 X좌표 위치
  // const y = useRef<number>(0);
  const image_width = useRef<number>(0); // 이미지의 너비
  const image_height = useRef<number>(0); // 이미지의 높이
  const ratio = 540 / 1080;
  const box_height = 1080;
  const box_width = box_height * ratio;
  const item_images = useRef<ItemImage[]>([]); // 장착 아이템 이미지 배열
  const equiped_item_ref = useRef<Item[]>(equiped_item);
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  const dyeFirstWidthRef = useRef<number>(0); // Ref로 선언
  const [is_selected, set_is_selected] = useState<boolean>(
    image_src !== process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg"
  );
  const localDB = new LocalDB("post_data", "user_image", false);

  // 사용자의 이미지를 그리는 함수
  const user_image_draw = useCallback(
    (x: number, y: number) => {
      if (!is_user_image_loaded.current) return;
      const user_canvas = imageRef.current;
      const image = user_image.current;
      if (!image) return;
      if (user_canvas) {
        const ctx = user_canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#EFF1F5";
          ctx.fillRect(0, 0, box_width, box_height); // 캔버스 초기화
          ctx.drawImage(
            image,
            -x,
            -y,
            image.height * ratio,
            image.height, // 원본 이미지의 위치 및 크기
            0,
            0,
            box_width,
            box_height // 캔버스에서의 위치 및 크기
          );
        }
      }
    },
    [box_width, ratio]
  );

  // 장착된 아이템을 그리는 함수
  const user_item_draw = useCallback(
    (item_list: Item[]) => {
      if (!item_background_image.current) return;
      if (!item_placeholder_image.current) return;
      if (!is_image_loaded.current) return;
      const user_canvas = imageRef.current;
      if (user_canvas) {
        const ctx = user_canvas.getContext("2d");
        if (ctx) {
          ctx.textAlign = "start";
          ctx.textBaseline = "top";

          // 아이템 표시 영역 초기화
          ctx.drawImage(
            item_background_image.current,
            box_width,
            0,
            user_canvas.width - box_width,
            user_canvas.height
          );
          let i = 0;

          if (item_list.every((item) => item.Id === 0)) {
            ctx.drawImage(
              item_placeholder_image.current,
              box_width + 31,
              43,
              496,
              326
            );
          }

          for (let item of item_list) {
            const image = item_images.current.find((i) => i.Id === item.Id);
            if (item.Id === 0) continue;

            // 아이템 아이콘 그리기
            if (image)
              ctx.drawImage(image.Image, box_width + 31, i * 114 + 43, 85, 85);
            ctx.font = "28px Pretendard";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(item.Name, box_width + 31 + 104, i * 114 + 51);

            ctx.fillStyle = "#212125";
            ctx.fillRect(box_width + 31, i * 114 + 138, 558, 1);

            // 1염색 컬러 표시
            // DyeFirst 값을 사용해 Color_background_list에서 색상 데이터 찾기
            const colorInfo1 = Color_background_list.find(
              (color) => color.color_id === item.DyeFirst
            );

            if (colorInfo1 && item.DyeFirst !== 0) {
              // 배경색과 텍스트 색상 설정
              const backgroundColor = colorInfo1.background_color || "#FFFFFF"; // 기본값 설정
              const textColor = colorInfo1.text_color || "black";

              // 텍스트 배경 그리기
              ctx.font = "21px Pretendard";
              const textWidth = ctx.measureText("1 - " + colorInfo1.name).width;
              dyeFirstWidthRef.current = textWidth;
              ctx.fillStyle = `#${backgroundColor}`; // 배경 색상
              ctx.fillRect(box_width + 135, i * 114 + 93, textWidth + 8, 26); // 배경 사각형 (텍스트 크기 기반)

              // 텍스트 그리기
              ctx.fillStyle = textColor; // 텍스트 색상
              ctx.fillText(
                "1 - " + colorInfo1.name,
                box_width + 139,
                i * 114 + 97
              );
            } else {
              dyeFirstWidthRef.current = 0;
            }

            // 2염색 컬러 표시
            // DyeFirst 값을 사용해 Color_background_list에서 색상 데이터 찾기
            const colorInfo2 = Color_background_list.find(
              (color) => color.color_id === item.DyeSecond
            );

            if (colorInfo2 && item.DyeSecond !== 0) {
              // 배경색과 텍스트 색상 설정
              const backgroundColor = colorInfo2.background_color || "#FFFFFF"; // 기본값 설정
              const textColor = colorInfo2.text_color || "black";

              // 텍스트 배경 그리기
              ctx.font = "21px Pretendard";
              const textWidth = ctx.measureText("2 - " + colorInfo2.name).width;
              ctx.fillStyle = `#${backgroundColor}`; // 배경 색상

              if (colorInfo1 && item.DyeFirst !== 0) {
                ctx.fillRect(
                  box_width + dyeFirstWidthRef.current + 151,
                  i * 114 + 93,
                  textWidth + 8,
                  26
                ); // 배경 사각형 (텍스트 크기 기반)

                // 텍스트 그리기
                ctx.fillStyle = textColor; // 텍스트 색상
                ctx.fillText(
                  "2 - " + colorInfo2.name,
                  box_width + dyeFirstWidthRef.current + 155,
                  i * 114 + 97
                );
              } else {
                ctx.fillRect(box_width + 135, i * 114 + 93, textWidth + 8, 26); // 배경 사각형 (텍스트 크기 기반)

                // 텍스트 그리기
                ctx.fillStyle = textColor; // 텍스트 색상
                ctx.fillText(
                  "2 - " + colorInfo2.name,
                  box_width + 139,
                  i * 114 + 97
                );
              }
            }
            i++;
          }

          ctx.textAlign = "end";
          ctx.textBaseline = "bottom";
          ctx.font = "16px Pretendard";
          ctx.fillStyle = "#BEBEBE";

          //ronkacloset.com
          ctx.fillText("ronkacloset.com", box_width + 614, 1048);
          ctx.fillText(
            "© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.",
            box_width + 614,
            1064
          );
        }
      }
    },
    [Color_background_list, box_width]
  );

  // 캔버스 이벤트 등록
  useEffect(() => {
    const user_canvas = imageRef.current;
    if (user_canvas == null) {
      return;
    }

    const mousedown_handler = (e: MouseEvent) => {
      if (!(user_canvas.offsetParent instanceof HTMLElement)) {
        return;
      }

      startX.current = e.pageX - user_canvas.offsetParent.offsetLeft; // 클릭 시작 X좌표 저장
      // startY.current = e.pageY -user_canvas.offsetTop;

      if (startX.current <= ratio * user_canvas.offsetHeight) {
        isDown.current = true;
      }
    };
    const mouseup_handler = (e: MouseEvent) => {
      isDown.current = false;
      e.preventDefault();
    };
    const mousemove_handler = (e: MouseEvent) => {
      if (!isDown.current) {
        return;
      }
      if (!(user_canvas.offsetParent instanceof HTMLElement)) {
        return;
      }
      e.preventDefault();

      // 이미지 이동 계산
      x.current +=
        (e.pageX - user_canvas.offsetParent.offsetLeft - startX.current) *
        (image_height.current / box_height);
      x.current = clamp(
        box_width * (image_height.current / box_height) - image_width.current,
        x.current,
        0
      );

      startX.current = e.pageX - user_canvas.offsetParent.offsetLeft; // 현재 X좌표 갱신
      user_image_draw(x.current, 0);
    };

    // 터치 이벤트 처리
    const touchstart_handler = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (!(user_canvas.offsetParent instanceof HTMLElement)) {
          return;
        }

        const touch = e.touches[0];
        startX.current = touch.pageX - user_canvas.offsetParent.offsetLeft;

        if (startX.current <= ratio * user_canvas.offsetHeight) {
          isDown.current = true;
        }
      }
    };

    const touchend_handler = (e: TouchEvent) => {
      isDown.current = false;
      e.preventDefault();
    };

    const touchcancel_handler = () => {
      isDown.current = false;
    };

    const touchmove_handler = (e: TouchEvent) => {
      if (!isDown.current || e.touches.length === 0) {
        return;
      }
      if (!(user_canvas.offsetParent instanceof HTMLElement)) {
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];

      // 터치로 이미지 이동 계산
      x.current +=
        (touch.pageX - user_canvas.offsetParent.offsetLeft - startX.current) *
        (image_height.current / box_height);
      x.current = clamp(
        box_width * (image_height.current / box_height) - image_width.current,
        x.current,
        0
      );
      startX.current = touch.pageX - user_canvas.offsetParent.offsetLeft;
      user_image_draw(x.current, 0);
    };

    // 마우스 및 터치 이벤트 등록
    user_canvas.addEventListener("mousedown", mousedown_handler);
    window.addEventListener("mouseup", mouseup_handler);
    window.addEventListener("mousemove", mousemove_handler);

    user_canvas.addEventListener("touchstart", touchstart_handler);
    user_canvas.addEventListener("touchend", touchend_handler);
    user_canvas.addEventListener("touchcancel", touchcancel_handler);
    user_canvas.addEventListener("touchmove", touchmove_handler);

    return () => {
      // 이벤트 해제
      user_canvas.removeEventListener("mousedown", mousedown_handler);
      window.removeEventListener("mouseup", mouseup_handler);
      window.removeEventListener("mousemove", mousemove_handler);

      user_canvas.removeEventListener("touchstart", touchstart_handler);
      user_canvas.removeEventListener("touchend", touchend_handler);
      user_canvas.removeEventListener("touchcancel", touchcancel_handler);
      user_canvas.removeEventListener("touchmove", touchmove_handler);
    };
  }, [box_width, ratio, user_image_draw]);

  // 아이템 배경 이미지 로드 및 초기화
  useEffect(() => {
    if (!item_background_image.current) return;
    if (!item_placeholder_image.current) return;
    is_image_loaded.current = false;
    item_background_image.current.src =
      process.env.NEXT_PUBLIC_BASE_URL + "/img/item_background.svg";
    item_placeholder_image.current.src =
      process.env.NEXT_PUBLIC_BASE_URL + "/img/placeholder.svg";

    const onload_handler = () => {
      if (!item_background_image.current) return;
      if (!item_placeholder_image.current) return;
      if (
        item_background_image.current.complete &&
        item_placeholder_image.current.complete
      ) {
        is_image_loaded.current = true;
        user_item_draw([]);
      }
    };
    item_background_image.current.onload = onload_handler;
    item_placeholder_image.current.onload = onload_handler;
  }, [user_item_draw]);

  // 사용자 이미지 로드 및 초기화
  useEffect(() => {
    if (!user_image.current) return;
    is_user_image_loaded.current = false;
    user_image.current.src = image_src;
    const onload_handler = () => {
      if (!user_image.current) return;
      is_user_image_loaded.current = true;
      image_width.current = user_image.current.width;
      image_height.current = user_image.current.height;
      user_image_draw(x.current, 0); // 초기 이미지 그리기
    };
    const onerror_handler = () => {
      set_image_src(process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg");
      set_is_selected(false);
      x.current = 0;
    };
    user_image.current.onload = onload_handler;
    user_image.current.onerror = onerror_handler;

    return () => {
      if (user_image.current) {
        user_image.current.onload = null;
        user_image.current.onerror = null;
      }
    };
  }, [image_src, user_image_draw]);

  // 아이템 이미지 로드 확인
  const image_load_check = useCallback(async () => {
    const image_load = (id: number, src: string): Promise<ItemImage> => {
      return new Promise((resolve, reject) => {
        const item_image = new Image();
        item_image.src = src;

        item_image.onload = () => resolve({ Id: id, Image: item_image });
        item_image.onerror = (error) => reject(error);
      });
    };

    try {
      const promises = equiped_item_ref.current.map((item) =>
        image_load(item.Id, process.env.NEXT_PUBLIC_BASE_URL + "/" + item.Icon)
      );
      item_images.current = await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
    user_item_draw(equiped_item_ref.current);
  }, [user_item_draw]);

  // 장착 아이템이 변경될 때 이미지 로드
  useEffect(() => {
    equiped_item_ref.current = equiped_item;
    image_load_check();
  }, [equiped_item, image_load_check]);

  const image_validate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력된 파일의 확장자 추출
    const ext = e.target.value.split(".").pop()?.toLowerCase();
    if (
      ["bmp", "png", "jpeg", "jpg"].includes(ext ?? "") &&
      e.target.files !== null
    ) {
      URL.revokeObjectURL(image_src);
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      localDB.open(1.0).then(() => {
        localDB.put(file, 1);
      });
      set_image_src(objectUrl);
      set_is_selected(true);
      x.current = 0;
    } else {
      console.log("유효하지 않은 이미지");
      e.target.value = "";
    }
  };

  const image_delete = () => {
    URL.revokeObjectURL(image_src);
    localDB.open(1.0).then(() => {
      localDB.clear();
    });

    set_image_src(process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg");
    set_is_selected(false);
    x.current = 0;
  };

  function CanvasClickLayer({ is_selected }: { is_selected: boolean }) {
    if (!is_selected) {
      return (
        <div className="input-container">
          <label htmlFor="canvas-input" className="canvas-input-label" />
          <input
            className="user-canvas-input"
            type="file"
            accept="image/bmp, image/png, image/jpeg"
            id="canvas-input"
            onChange={image_validate}
          />
        </div>
      );
    } else {
      return (
        <div className="input-container">
          <div className="image-delete" onClick={image_delete}>
            이미지 삭제
          </div>
        </div>
      );
    }
  }

  return (
    <div className="canvas-container">
      <CanvasClickLayer is_selected={is_selected} />
      <canvas
        className="user-canvas"
        width={box_width + 630}
        height="1080"
        ref={imageRef}
      />
    </div>
  );
}
