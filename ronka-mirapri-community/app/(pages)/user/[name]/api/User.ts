// 유저페이지에서 유저정보 표시

export const getUserInfo = async (name: string) => {
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
      throw new Error(error.message || "유저 정보 조회 실패");
    }
    throw error;
  }
};
