const gender_category = ["전체", "여성", "남성"];
const race_category = [
  "중원 휴런",
  "고원 휴런",
  "미코테",
  "엘레젠",
  "루가딘",
  "라라펠",
  "아우라",
  "로스가르",
  "비에라",
];
const job_category = [
  "모든 클래스",
  "수호자",
  "나이트",
  "전사",
  "암흑기사",
  "건브레이커",
  "학살자",
  "용기사",
  "리퍼",
  "타격대",
  "몽크",
  "사무라이",
  "정찰대",
  "닌자",
  "바이퍼",
  "유격대",
  "음유시인",
  "기공사",
  "무도가",
  "치유사",
  "백마도사",
  "학자",
  "점성술사",
  "현자",
  "마술사",
  "흑마도사",
  "소환사",
  "적마도사",
  "픽토맨서",
  "청마도사",
  "제작자",
  "채집가",
];
const job_category_group: { [key: string]: string[] } = {
  "모든 클래스": job_category.filter((i) => i !== "모든 클래스"),
  수호자: ["나이트", "전사", "암흑기사", "건브레이커"],
  학살자: ["용기사", "리퍼"],
  타격대: ["몽크", "사무라이"],
  정찰대: ["닌자", "바이퍼"],
  유격대: ["음유시인", "기공사", "무도가"],
  치유사: ["백마도사", "학자", "점성술사", "현자"],
  마술사: ["흑마도사", "소환사", "적마도사", "픽토맨서", "청마도사"],
};

const item_null = {
  Id: 0,
  Name: "",
  Icon: "/img/item_slot.svg",
  EquipSlotCategory: 6,
  ClassJobCategory: 0,
  DyeCount: 0,
  DyeFirst: 0,
  DyeSecond: 0,
};

const editor_init_state: {
  title: string;
  content: string;
  sns: string;
  gender: string;
  race: string | null;
  job: string[];
  tag: string[];
} = {
  title: "",
  content: "",
  sns: "",
  gender: "공용",
  race: null,
  job: [],
  tag: [],
};

export {
  gender_category,
  race_category,
  job_category,
  job_category_group,
  item_null,
  editor_init_state,
};
