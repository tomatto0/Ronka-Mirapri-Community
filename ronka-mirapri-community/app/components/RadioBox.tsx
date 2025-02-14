import "../css/FilterSelector.css";

export default function RadioBox({
  name,
  value,
  category,
  change_handler,
}: {
  name: any;
  value: any;
  category: string;
  change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label htmlFor={`${category}-${name.replace(" ", "-")}`}>
      <p
        className={`filter-item ${value === name ? "filter-item-active" : ""}`}
      >
        {name}
      </p>
      <input
        type="radio"
        id={`${category}-${name.replace(" ", "-")}`}
        name={category}
        value={name}
        checked={value == name}
        onChange={change_handler}
        style={{ display: "none" }}
      />
    </label>
  );
}
