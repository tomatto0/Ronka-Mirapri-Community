//메인페이지에서 posts를 불러옴
export const fetchPosts = async (
  page: number,
  size: number,
  filter: string,
  order: string
) => {
  try {
    const response = await fetch(
      `/api/db/posts/list?page=${page}&size=${size}&filter=${filter}${
        order === "인기순" ? "&order=fav" : ""
      }`
    );

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "메인 포스트 리스트 조회 실패");
    }
    throw error;
  }
};
