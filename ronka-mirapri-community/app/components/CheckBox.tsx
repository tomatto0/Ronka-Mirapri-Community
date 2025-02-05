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
      <span>{name + (value.includes(name) ? "O" : "")}</span>
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
