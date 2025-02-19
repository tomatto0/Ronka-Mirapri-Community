"use client";

import "../css/SignUp.css";
import cursed_word_check from "@/app/utils/cursed_word_check";
import nickname_validate from "@/app/utils/nickname_check";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Page_sign_up() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, set_email] = useState<string>(session?.user?.email || "");
  const [email_error, set_email_error] = useState<string>("");
  const [nickname, set_nickname] = useState<string>("");
  const [nickname_error, set_nickname_error] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const [sns_error, set_sns_error] = useState<string>("");
  const [is_error, set_is_error] = useState<boolean>(false);
  const is_user_load = useRef<boolean>(false);

  const signup_handler = async () => {
    set_is_error(false);
    const nickname_message = nickname_validate(nickname);
    if (nickname_message !== "") {
      set_nickname_error(nickname_message);
      set_is_error(true);
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
    const user = { email, nickname, sns };
    const response = await fetch("/api/db/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return false;
    }
    const res = await response.json();
    if (res.success === false) {
      if (res.error === "Unknown error") {
        Swal.fire({
          text: "알수없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        }).then(() => {
          signIn("google", { callbackUrl: "/signup" });
        });
      } else {
        set_email_error(res.error.email_message);
        set_nickname_error(res.error.nickname_message);
        set_sns_error(res.error.sns_message);
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (status !== "loading") {
      if (session?.user.email) {
        set_email(session.user.email);
        if ("nickname" in session.user) {
          console.log("이미 회원가입됨");
          // router.push(sessionStorage.getItem("login_callback") || "/");
          // sessionStorage.removeItem("login_callback");
        }
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
          <h3>가입하기</h3>
          <div className="signup-inputs">
            <label className="signup-label" htmlFor="email">
              구글 이메일
            </label>
            <span>*</span>
            <input type="text" disabled value={email} id="email" />
            <p>
              <Link
                href="#"
                onClick={() => signIn("google", { callbackUrl: "/signup" })}
              >
                {email_error}
              </Link>
            </p>
            <div className="signup-title">
              <label className="signup-label" htmlFor="nickname">
                닉네임
              </label>
              <span>*</span>{" "}
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
          <button className="signup-submit" onClick={signup_handler}>
            가입하기
          </button>
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
