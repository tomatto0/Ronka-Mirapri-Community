import cursed_word_check from "./cursed_word_check";

export default function nickname_validate(text: string): string {
  if (!text) {
    return "닉네임이 필요합니다.";
  }
  if (text.length < 2 || text.length > 20) {
    return "닉네임은 2자 이상, 20자 이하여합니다.";
  }
  if (/[^a-zA-Z가-힣0-9\-_']/g.test(text)) {
    return "닉네임은 한글, 영어, 숫자, 특수기호(-, _, ')만 포함할 수 있습니다.";
  }
  if (cursed_word_check(text)) {
    return "닉네임에 부적절한 단어가 포함되어있습니다. 부적절한 닉네임을 사용할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
  }
  return "";
}
