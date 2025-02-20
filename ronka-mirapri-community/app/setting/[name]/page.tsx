"use client";

import { useGetUserInfo } from "@/app/(pages)/user/[name]/hooks/useUserInfo";
import "../../css/SignUp.css";
import cursed_word_check from "@/app/utils/cursed_word_check";
import nickname_validate from "@/app/utils/nickname_check";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page_sign_up() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const userName = params.name;

  const [email, set_email] = useState<string>(session?.user?.email || "");
  const [nickname, set_nickname] = useState<string>("");
  const [nickname_error, set_nickname_error] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const [sns_error, set_sns_error] = useState<string>("");
  const [is_error, set_is_error] = useState<boolean>(false);

  const userInfo = useQuery({
    queryKey: ["UserInfo", userName],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/db/users/public/?name=${userName}`);
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
    },
    staleTime: 5000, // 5초
    gcTime: 1000 * 60 * 10, // 30분
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const { mutate: edit_user } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/db/users`, {
          method: "PATCH",
          body: JSON.stringify({
            id: userInfo.data._id ?? "",
            nickname,
            sns,
          }),
        });
        const res = await response.json();
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
        await update({ nickname, sns });
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
        if (res.error) {
          console.log(res.error);
          set_nickname_error(res.error.nickname_message);
          set_sns_error(res.error.sns_message);
        } else {
          Swal.fire({
            title: "회원정보 수정에 실패했습니다.",
            text: "알 수 없는 에러",
            icon: "error",
          });
        }
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
      const block_response = await fetch(`/api/db/blacklist`, {
        method: "POST",
        body: JSON.stringify({ email: userInfo.data.email }),
      });
      const block_res = await block_response.json();
      if (!block_res.success) {
        return block_res;
      }
      const response = await fetch(`/api/db/users`, {
        method: "DELETE",
        body: JSON.stringify({ id: userInfo.data._id }),
      });
      const res = await response.json();
      return res;
    },
    onSuccess: async res => {
      if (res.success) {
        await Swal.fire({ title: "회원 차단에 성공했습니다." });
        router.push("/");
      } else {
        Swal.fire({
          title: "회원 차단에 실패했습니다.",
          text: res.errror ?? "알 수 없는 에러",
          icon: "error",
        });
      }
    },
    onError: error => {
      Swal.fire({
        title: "회원 차단에 실패했습니다.",
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
    if (sns.length > 100) {
      set_sns_error("SNS url은 100자 이하여야 합니다.");
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
    const result = await Swal.fire({
      title: "정말로 탈퇴하시겠습니까?",
      icon: "warning",
      confirmButtonText: "탈퇴",
      showCancelButton: true,
      cancelButtonText: "취소",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      delete_user();
    }
  };
  const cancle_handler = () => {
    router.back();
  };
  useEffect(() => {
    if (status !== "loading" && userInfo.status !== "pending") {
      if (session?.user.is_admin) {
        set_email(userInfo.data.email ?? "");
        set_nickname(userInfo.data.nickname ?? "");
        set_sns(userInfo.data.sns ?? "");
      } else {
        router.push("/");
      }
    }
  }, [status, userInfo.status]);

  if (status === "loading") {
    return (
      <main className="signup-fill">
        <span className="loading"></span>
      </main>
    );
  }

  if (session?.user.login) {
    return (
      <main className="signup-fill">
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
            차단하기
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

  return <main className="signup-fill"></main>;
}
