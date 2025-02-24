//메인페이지에서 posts를 불러옴
export const getNews = async () => {
  try {
    const response = await fetch(
      `/api/db/news/
      `
    );

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "뉴스 리스트 조회 실패");
    }
    throw error;
  }
};
