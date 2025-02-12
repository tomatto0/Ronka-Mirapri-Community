"use client";

import cursed_word_check from "@/app/utils/cursed_word_check";
import nickname_check from "@/app/utils/nickname_check";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page_sign_up() {
  const { data: session, status } = useSession();
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
    const nickname_message = nickname_check(nickname);
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
      console.log(res.error);
      set_email_error(res.error.email_message);
      set_nickname_error(res.error.nickname_message);
      set_sns_error(res.error.sns_message);
      return false;
    }
    window.location.href = "/";
    return true;
  };

  useEffect(() => {
    if (status !== "loading") {
      if (session && session.user) {
        set_email(session.user.email as string);
        if ("nickname" in session.user) {
          window.location.href =
            sessionStorage.getItem("login_callback") || "/";
          sessionStorage.setItem("login_callback", "/");
        } else {
          is_user_load.current = true;
        }
      }
    }
  }, [status]);

  if (status === "loading") {
    return <main></main>;
  }

  if (session && session.user && session.user.email) {
    return (
      <main>
        <p>Welcome! Please complete your sign-up process.</p>
        <label htmlFor="email">email: </label>
        <input type="text" disabled value={email} id="email" />
        <p>
          <Link
            href="#"
            onClick={() => signIn("google", { callbackUrl: "/signup" })}
          >
            {email_error}
          </Link>
        </p>
        <label htmlFor="nickname">nickname: </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={e => {
            set_nickname(e.target.value);
          }}
        />
        <span>*</span>
        <p>{nickname_error}</p>
        <label htmlFor="sns">sns: </label>
        <input
          type="text"
          id="sns"
          value={sns}
          onChange={e => {
            set_sns(e.target.value);
          }}
        />
        <p>{sns_error}</p>
        <button onClick={signup_handler}>sign up</button>
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
