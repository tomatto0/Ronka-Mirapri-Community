import Link from "next/link";
import "../css/FlowText.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Itemrank({ itemrank }: { itemrank: string[] }) {
  const flowRef = useRef<HTMLDivElement[]>([]);
  const [text_iterate_number, set_text_iterate_number] = useState<number>(1);
  const [view_width, set_view_width] = useState<number>(window.innerWidth);

  function reset_animation() {
    flowRef.current.forEach(e => {
      if (e) {
        e.style.animation = "none";
        void e.offsetWidth;
        e.style.animation = "";
      }
    });
  }

  useEffect(() => {
    if (flowRef.current.length !== 0) {
      const resizeObserver = new ResizeObserver(entries => {
        set_text_iterate_number(
          Math.max(
            Math.ceil(
              view_width / entries[0].target.getBoundingClientRect().width
            ) + 1,
            1
          )
        );
        reset_animation();
      });
      resizeObserver.observe(flowRef.current[0]);
      return () => resizeObserver.disconnect();
    }
  }, [view_width]);

  useEffect(() => {
    const resize_handler = () => {
      set_view_width(window.innerWidth);
    };
    window.addEventListener("resize", resize_handler);
    return () => {
      window.removeEventListener("resize", resize_handler);
    };
  }, []);

  return (
    <div className="flow-text-wrap">
      <div className="flow-text-container">
        {Array.from({ length: text_iterate_number }).map((_, index) => (
          <div
            className="flow-text-half"
            key={index}
            ref={e => {
              if (e && !flowRef.current.includes(e)) {
                flowRef.current[index] = e;
              }
            }}
          >
            {itemrank.map(item => (
              <Link href={`/?keyword=${item}`} className="flow-text" key={item}>
                {item}{" "}
                <img
                  src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                  alt="modal open button"
                />
              </Link>
            ))}
            <p className="flow-text title">
              주간인기 TOP 10 ITEM{" "}
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                alt="modal open button"
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
