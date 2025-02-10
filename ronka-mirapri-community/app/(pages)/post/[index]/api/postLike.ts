//메인페이지에서 1개 post의 like count를 불러옴
export const getPostLikes = async (postIndex: number) => {
  try {
    const response = await fetch(
      `/api/db/posts/index/likes?index=${postIndex}`
    );

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "포스트 좋아요 정보 조회 실패");
    }
    throw error;
  }
};

export const deleteLike = async (postId: string) => {
  const response = await fetch(`/api/db/likes`, {
    method: "DELETE",
    body: JSON.stringify({ post: postId }),
  });
  return await response.json();
};

export const addLike = async (postId: string) => {
  const response = await fetch(`/api/db/likes`, {
    method: "POST",
    body: JSON.stringify({ post: postId }),
  });
  return await response.json();
};
