import "../css/FlowText.css";

export default function Itemrank({ itemrank }: { itemrank: string[] }) {
  console.log(itemrank);
  return (
    <div className="flow-text-wrap">
      <div className="flow-text-container">
        <div className="flow-text-half">
          {itemrank.map(item => (
            <p className="flow-text" key={item}>
              {item}{" "}
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                alt="modal open button"
              />
            </p>
          ))}
          <p className="flow-text title">
            주간인기 TOP 10 ITEM{" "}
            <img
              src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
              alt="modal open button"
            />
          </p>
        </div>

        <div className="flow-text-half">
          {itemrank.map(item => (
            <p className="flow-text" key={item}>
              {item}{" "}
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                alt="modal open button"
              />
            </p>
          ))}
          <p className="flow-text title">
            주간인기 TOP 10 ITEM{" "}
            <img
              src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
              alt="modal open button"
            />
          </p>
        </div>

        <div className="flow-text-third">
          {itemrank.map(item => (
            <p className="flow-text" key={item}>
              {item}{" "}
              <img
                src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
                alt="modal open button"
              />
            </p>
          ))}
          <p className="flow-text title">
            주간인기 TOP 10 ITEM{" "}
            <img
              src={process.env.NEXT_PUBLIC_BASE_URL + "/img/plus-green.svg"}
              alt="modal open button"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
