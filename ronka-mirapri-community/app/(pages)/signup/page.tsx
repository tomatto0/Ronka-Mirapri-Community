"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function signup_page() {
  const { data: session, status } = useSession();
  const [email, set_email] = useState<string>(session?.user?.email || "");
  const [nickname, set_nickname] = useState<string>("");
  const [sns, set_sns] = useState<string>("");
  const is_user_load = useRef<boolean>(false);

  const signup_handler = async () => {
    if (!nickname) {
      return false;
    }
    const user = { email, nickname, sns };
    const response = await fetch("/db/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return false;
    }
    const res = await response.json();
    if (res.success === false) {
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

  if (!is_user_load.current) {
    return;
  }

  if (session && session.user && session.user.email) {
    return (
      <div>
        <p>Welcome! Please complete your sign-up process.</p>
        <label htmlFor="email">email: </label>
        <input type="text" disabled value={email} id="email" />
        <br />
        <label htmlFor="nickname">nickname: </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => {
            set_nickname(e.target.value);
          }}
        />
        <span>*</span>
        <br />
        <label htmlFor="sns">sns: </label>
        <input
          type="text"
          id="sns"
          value={sns}
          onChange={(e) => {
            set_sns(e.target.value);
          }}
        />
        <br />
        <button onClick={signup_handler}>sign up</button>
      </div>
    );
  }

  return (
    <div>
      <p>Please log in to sign up.</p>
      <button onClick={() => signIn("google", { callbackUrl: "/signup" })}>
        Sign in with Google
      </button>
    </div>
  );
}
