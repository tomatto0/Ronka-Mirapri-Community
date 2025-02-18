import { Item } from "../types/Item";
import { post_init_state } from "./constants";
import cursed_word_check from "./cursed_word_check";

export default function post_validate(
  image_src: string,
  equiped_item: Item[],
  post_data: typeof post_init_state
) {
  const message = {
    is_validate: true,
    image: "",
    item: "",
    title: "",
    content: "",
    sns: "",
    race: "",
    job: "",
    tag: "",
  };
  if (image_src === process.env.NEXT_PUBLIC_BASE_URL + "/img/thumbnail.svg") {
    message.is_validate = false;
    message.image = "이미지가 필요합니다.";
  }
  if (equiped_item.every(i => i.Id === 0)) {
    message.is_validate = false;
    message.item = "아이템을 선택해주세요.";
  }
  if (post_data.title === "") {
    message.is_validate = false;
    message.title = "제목을 입력해주세요.";
  }
  if (post_data.title.length > 20) {
    message.is_validate = false;
    message.title = "제목은 20자 이내로 작성해주세요.";
  }
  if (cursed_word_check(post_data.title)) {
    message.is_validate = false;
    message.title =
      "제목에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
  }
  if (post_data.content.length > 300) {
    message.is_validate = false;
    message.content = "내용은 300자 이내로 작성해주세요.";
  }
  if (cursed_word_check(post_data.content)) {
    message.is_validate = false;
    message.content =
      "내용에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
  }
  if (cursed_word_check(post_data.sns)) {
    message.is_validate = false;
    message.sns =
      "SNS에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
  }
  if (post_data.tag.some(i => cursed_word_check(i))) {
    message.is_validate = false;
    message.tag =
      "태그에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
  }
  if (post_data.race === null) {
    message.is_validate = false;
    message.race = "종족을 선택해주세요.";
  }
  if (post_data.job.length === 0) {
    message.is_validate = false;
    message.job = "직업을 선택해주세요.";
  }
  return message;
}
