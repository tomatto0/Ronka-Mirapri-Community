"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page_test() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const sign_out_handler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/db/users`,
      { method: "DELETE", body: JSON.stringify({ id: session?.user?._id }) }
    );
  };
  const toast_handler = () => {
    Swal.fire({
      title: "삭제에 실패했습니다.",
      text: "알 수 없는 에러",
      icon: "error",
    });
  };

  return (
    <div>
      <button onClick={sign_out_handler}>탈퇴</button>
      <button onClick={toast_handler}>글 작성</button>
    </div>
  );
}
