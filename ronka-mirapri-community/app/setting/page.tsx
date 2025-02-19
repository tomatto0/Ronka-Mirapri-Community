"use client";

import "../css/SignUp.css";
import cursed_word_check from "@/app/utils/cursed_word_check";
import nickname_validate from "@/app/utils/nickname_check";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Page_sign_up() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [email, set_email] = useState<string>(session?.user?.email || "");
  const [nickname, set_nickname] = useState<string>("");
  const [nickname_error, set_nickname_error] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const [sns_error, set_sns_error] = useState<string>("");
  const [is_error, set_is_error] = useState<boolean>(false);

  const { mutate: edit_user } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/db/users`, {
          method: "PATCH",
          body: JSON.stringify({
            id: session?.user._id ?? "",
            nickname,
            sns,
          }),
        });
        const res = await response.json();
        if (res.success) {
          await update({ nickname, sns });
        }
        return res;
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(e.message || "삭제 실패");
        }
        throw e;
      }
    },
    onSuccess: async res => {
      if (res.success) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          timer: 3000,
          showConfirmButton: false,
        });
        Toast.fire({
          icon: "success",
          text: "회원정보 수정이 완료되었습니다.",
        });
        router.push(`/user/${nickname}`);
      } else {
        Swal.fire({
          title: "회원정보 수정에 실패했습니다.",
          text: res.error ?? "알 수 없는 에러",
          icon: "error",
        });
      }
    },
    onError: error => {
      Swal.fire({
        title: "회원정보 수정에 실패했습니다.",
        text: error.message ?? "알 수 없는 에러",
        icon: "error",
      });
    },
  });
  const { mutate: delete_user } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/db/users`, {
        method: "DELETE",
        body: JSON.stringify({ id: session?.user?._id }),
      });
      const res = await response.json();
      return res;
    },
    onSuccess: async res => {
      if (res.success) {
        Swal.fire({ title: "회원 탈퇴에 성공했습니다." });
        signOut();
      } else {
        Swal.fire({
          title: "회원 탈퇴에 실패했습니다.",
          text: res.errror ?? "알 수 없는 에러",
          icon: "error",
        });
      }
    },
    onError: error => {
      Swal.fire({
        title: "회원 탈퇴에 실패했습니다.",
        text: error.message ?? "알 수 없는 에러",
        icon: "error",
      });
    },
  });

  const edit_handler = async () => {
    set_is_error(false);
    const nickname_message = nickname_validate(nickname);
    if (nickname_message !== "") {
      set_nickname_error(nickname_message);
      set_is_error(true);
    }
    if (sns.length > 50) {
      set_sns_error("SNS url은 50자 이하여야 합니다.");
    }
    if (cursed_word_check(sns)) {
      set_sns_error(
        "SNS에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다."
      );
      set_is_error(true);
    }
    if (is_error) {
      return false;
    }
    edit_user();
    return true;
  };
  const delete_handler = async () => {
    const result = Swal.fire({
      title: "정말로 탈퇴하시겠습니까?",
      icon: "warning",
      confirmButtonText: "탈퇴",
      showCancelButton: true,
      cancelButtonText: "취소",
      reverseButtons: true,
    });
  };
  const cancle_handler = () => {
    router.back();
  };

  useEffect(() => {
    if (status !== "loading") {
      if (session?.user.login) {
        set_email(session.user.email ?? "");
        set_nickname(session.user.nickname ?? "");
        set_sns(session.user.sns ?? "");
      }
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main>
        <span className="loading"></span>
      </main>
    );
  }

  if (session?.user.email) {
    return (
      <main>
        <div className="signup-wrap">
          <div className="signup-logo">
            <img alt="Ronka LookBook logo" id="signup-title" />
          </div>
          <h3>회원 정보 수정</h3>
          <div className="signup-inputs">
            <label className="signup-label" htmlFor="email">
              구글 이메일
            </label>
            <input type="text" disabled value={email} id="email" />
            <p></p>
            <div className="signup-title">
              <label className="signup-label" htmlFor="nickname">
                닉네임
              </label>
            </div>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={e => {
                set_nickname(e.target.value);
              }}
            />
            <p className="signup-error">{nickname_error}</p>
            <div className="signup-title">
              <label className="signup-label" htmlFor="sns">
                SNS URL
              </label>
            </div>
            <input
              type="text"
              id="sns"
              value={sns}
              onChange={e => {
                set_sns(e.target.value);
              }}
            />
            <p className="signup-error">{sns_error}</p>
          </div>
          <button className="withdraw-submit" onClick={delete_handler}>
            탈퇴하기
          </button>
          <div className="setting-button-container">
            <button className="cancle-submit" onClick={cancle_handler}>
              취소하기
            </button>
            <button className="edit-submit" onClick={edit_handler}>
              수정하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <p>Please log in to sign up.</p>
      <button onClick={() => signIn("google", { callbackUrl: "/signup" })}>
        Sign in with Google
      </button>
    </main>
  );
}
