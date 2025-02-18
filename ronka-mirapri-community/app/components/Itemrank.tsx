import Link from "next/link";
import "../css/FlowText.css";
import { useEffect, useRef, useState } from "react";

export default function Itemrank({ itemrank }: { itemrank: string[] }) {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [text_iterate_number, set_text_iterate_number] = useState<number>(1);

  useEffect(() => {
    if (flowRef.current !== null) {
      const resizeObserver = new ResizeObserver(entries => {
        set_text_iterate_number(
          Math.ceil(
            document.documentElement.clientWidth /
              entries[0].target.getBoundingClientRect().width
          ) + 1
        );
      });
      resizeObserver.observe(flowRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="flow-text-wrap">
      <div className="flow-text-container">
        {Array.from({ length: text_iterate_number }).map((_, index) => (
          <div
            className="flow-text-half"
            key={index}
            ref={index === 0 ? flowRef : null}
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
