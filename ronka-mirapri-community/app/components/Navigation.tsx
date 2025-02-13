"use client";

import "../css/Navigation.css";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <>
      <div className="navigation_wrap">
        <div className="logo">
          <Link href="/">
            <img alt="Ronka LookBook logo" id="title" />
          </Link>
        </div>
        <ul className="menus">
          <li>
            <Link href="/" className="menu">
              GALLERY
            </Link>
          </li>

          <li>
            <Link href="/editor" className="menu">
              GENERATOR
            </Link>
          </li>

          <li>
            <Link href="/" className="menu">
              ABOUT
            </Link>
          </li>
          {session?.user?.login ? (
            <li>
              <Link href={`/user/${session?.user.nickname}`} className="menu">
                MYPAGE
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
        <div className="navigation_right">
          {session?.user?.login ? (
            <div onClick={() => signOut()}>LOGOUT</div>
          ) : (
            <ul className="menus">
              <li onClick={() => signIn("google", { callbackUrl: "/signup" })}>
                LOGIN
              </li>
              <li onClick={() => signIn("google", { callbackUrl: "/signup" })}>
                JOIN
              </li>
            </ul>
          )}
          <img alt="search icon" id="search" />
        </div>
      </div>
    </>
  );
}
