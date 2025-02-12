import "../css/FilterSelector.css";

export default function CheckBox({
  name,
  value,
  category,
  change_handler,
}: {
  name: string;
  value: string[];
  category: string;
  change_handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label htmlFor={`${category}-${name.replace(" ", "-")}`}>
      <p
        className={`filter_item ${
          value.includes(name) ? "filter_item_active" : ""
        }`}
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
