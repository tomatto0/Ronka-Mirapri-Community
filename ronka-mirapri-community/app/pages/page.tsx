"use client";

import React from "react";

export default function home() {
  const google_login = () => {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;
    const redirect_url = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const scope =
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    const auth_url =
      `https://accounts.google.com/o/oauth2/auth?` +
      `response_type=code&` +
      `client_id=${client_id}&` +
      `redirect_uri=${redirect_url}&` +
      `scope=${encodeURIComponent(scope)}` +
      `&access_type=offline`;
    window.location.href = auth_url;
  };
  return (
    <div>
      <p>test google login page</p>
      <button onClick={google_login}>Login with Google</button>
    </div>
  );
}
