"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page_test() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const sign_out_handler = async () => {
    return Swal.fire({
      title: "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?",
      icon: "info",
      confirmButtonText: "로그인",
      showCancelButton: true,
      cancelButtonText: "취소",
      reverseButtons: true,
    });
  };
  const toast_handler = async () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
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
