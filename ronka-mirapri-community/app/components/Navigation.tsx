"use client";

import "../css/Navigation.css";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import FilterSelector from "./FilterSelector";
import { useEffect, useRef, useState } from "react";
import { filter_tag_init_state } from "../utils/constants";
import NavMobile from "./NavMobile";

export default function Navigation() {
  const { data: session } = useSession();
  const router = useRouter();

  const pathname = usePathname();
  const [active_path, set_active_path] = useState<string>("");

  useEffect(() => {
    // 현재 경로를 activePath로 설정
    set_active_path(decodeURIComponent(pathname));
  }, [pathname]);

  const isActive = (path: string) => {
    return active_path === decodeURIComponent(path);
  };

  const [filter, set_filter] = useState<string>("{}");
  const [filter_tag, set_filter_tag] = useState<typeof filter_tag_init_state>(
    filter_tag_init_state
  );
  const [is_open, set_is_open] = useState<boolean>(false);
  const [is_mobile_nav_open, set_is_mobile_nav_open] = useState<boolean>(false);
  const renderingRef = useRef<boolean>(true);

  const search = () => {
    if (!is_open) {
      const session_filter = JSON.parse(
        sessionStorage.getItem("filter") ?? "{}"
      );
      set_filter(session_filter.filter ?? "{}");
      set_filter_tag(session_filter.filter_tag ?? filter_tag_init_state);
    }
    set_is_open(prev => !prev);
  };

  const filter_tag_handler = (filter_tag: typeof filter_tag_init_state) => {
    set_filter_tag(filter_tag);
    sessionStorage.setItem("filter", JSON.stringify({ filter, filter_tag }));
    router.push(`/search?keyword=${filter_tag.keyword}`);
  };

  const mobile_nav = () => {
    set_is_mobile_nav_open(prev => !prev);
  };

  return (
    <>
      <div className="navigation_wrap">
        <div className="logo">
          <Link href="/">
            <img alt="Ronka LookBook logo" id="title" />
          </Link>
        </div>
        <ul className="menus">
          <li className={isActive("/") ? "nav-active" : ""}>
            <Link href="/" className="menu">
              GALLERY
            </Link>
          </li>
          <li className={isActive("/editor") ? "nav-active" : ""}>
            <Link href="/editor" className="menu">
              GENERATOR
            </Link>
          </li>
          <li className={isActive("/about") ? "nav-active" : ""}>
            <Link href="/" className="menu">
              ABOUT
            </Link>
          </li>
          {session?.user?.login && (
            <li
              className={
                isActive(`/user/${session?.user.nickname}`) ? "nav-active" : ""
              }
            >
              <Link href={`/user/${session?.user.nickname}`} className="menu">
                MYPAGE
              </Link>
            </li>
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
          <button className="search-button" onClick={search}>
            <img alt="search icon" id="search" />
          </button>
          <button className="search-button" onClick={mobile_nav}>
            <img alt="hamburger icon" id="menu-bar" />
          </button>
        </div>
      </div>
      <FilterSelector
        filter={filter}
        set_filter={set_filter}
        filter_tag={filter_tag}
        set_filter_tag={filter_tag_handler}
        is_open={is_open}
        set_is_open={set_is_open}
      />
      <NavMobile
        is_mobile_nav_open={is_mobile_nav_open}
        set_is_mobile_nav_open={set_is_mobile_nav_open}
      />
    </>
  );
}
