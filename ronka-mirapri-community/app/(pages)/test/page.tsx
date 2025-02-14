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
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      timer: 3000,
      showConfirmButton: false,
    });
    Toast.fire({ icon: "success", title: "글 작성이 완료되었습니다." });
    router.push("/");
  };

  return (
    <div>
      <button onClick={sign_out_handler}>탈퇴</button>
      <button onClick={toast_handler}>글 작성</button>
    </div>
  );
}
