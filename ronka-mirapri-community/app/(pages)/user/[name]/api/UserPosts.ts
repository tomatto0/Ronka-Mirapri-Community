//유저페이지에서 유저가 작성한 게시물을 요청
export const getUserPosts = async (
  page: number,
  name: string,
  size: number
) => {
  try {
    const response = await fetch(
      `/api/db/users/posts?name=${name}&page=${page}&size=${size}`
    );

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "유저 포스트 리스트 조회 실패");
    }
    throw error;
  }
};

//유저페이지에서 유저가 좋아요한 게시물을 요청
export const getUserLikedPosts = async (
  page: number,
  name: string,
  size: number
) => {
  try {
    const response = await fetch(
      `/api/db/users/liked?name=${name}&page=${page}&size=${size}`
    );

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "유저가 좋아요한 포스트 리스트 조회 실패"
      );
    }
    throw error;
  }
};
