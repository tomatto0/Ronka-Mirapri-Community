"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page_test() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const sign_out_handler = async () => {
    Swal.fire({
      title: "회원 탈퇴에 성공했습니다.",
      icon: "success",
      showConfirmButton: false,
      timer: 3000,
    });
  };
  const toast_handler = async () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 300000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
  };

  return (
    <div>
      <img alt="heart" id="fill-heart-green" />
      <img alt="heart" id="hollow-heart-green" />
      <img alt="heart" id="fill-heart-teal" />
      <img alt="heart" id="hollow-heart-white" />
      <button onClick={sign_out_handler}>탈퇴</button>
      <button onClick={toast_handler}>글 작성</button>
    </div>
  );
}
