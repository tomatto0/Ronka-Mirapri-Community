import "../css/FilterSelector.css";

export default function CheckBox({
  name,
  value,
  category,
  change_handler,
  className = "",
}: {
  name: string;
  value: string[];
  category: string;
  change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <label htmlFor={`${category}-${name.replace(" ", "-")}`}>
      <p
        className={[
          "filter-item",
          className,
          value.includes(name) ? "filter-item-active" : "",
        ].join(" ")}
      >
        {name}
      </p>
      <input
        type="checkbox"
        id={`${category}-${name.replace(" ", "-")}`}
        name={category}
        value={name}
        checked={value.includes(name)}
        onChange={change_handler}
        style={{ display: "none" }}
      />
    </label>
  );
}
