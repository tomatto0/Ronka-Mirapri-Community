import cursed_word from "../json/cursed_word.json";
export default function cursed_word_check(text: string) {
  return cursed_word.some(word =>
    text
      .toLowerCase()
      .replace(/[ 0-9\-\_\|\/]/g, "")
      .includes(word)
  );
}
