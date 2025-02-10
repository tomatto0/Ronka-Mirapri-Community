//유저페이지에서 유저가 작성한 게시물을 요청
export const getUserPosts = async (name: number) => {
  try {
    const response = await fetch(`/api/db/users/public?name=${name}`);

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "포스트 리스트 조회 실패");
    }
    throw error;
  }
};
