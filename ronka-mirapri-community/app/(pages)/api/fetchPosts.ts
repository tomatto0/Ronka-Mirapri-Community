//메인페이지에서 posts를 불러옴
export const fetchPosts = async (
  page: number,
  size: number,
  filter: string,
  order: string
) => {
  const response = await fetch(
    `/api/db/posts/list?page=${page}&size=${size}&filter=${filter}${
      order === "인기순" ? "&order=fav" : ""
    }`
  );
  const res = await response.json();
  return res;
};
