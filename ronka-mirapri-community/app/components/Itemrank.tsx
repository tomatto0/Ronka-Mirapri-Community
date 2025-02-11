export default function Itemrank({ itemrank }: { itemrank: string[] }) {
  return <p>item TOP10: {itemrank.join(", ")}</p>;
}
