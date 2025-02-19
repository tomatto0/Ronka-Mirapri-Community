import "../css/MobileNav.css";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavMobile({
  is_mobile_nav_open,
  set_is_mobile_nav_open,
}: {
  is_mobile_nav_open: boolean;
  set_is_mobile_nav_open: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [active_path, set_active_path] = useState<string>("");

  useEffect(() => {
    // 현재 경로를 activePath로 설정
    set_active_path(decodeURIComponent(pathname));
  }, [pathname]);

  const isActive = (path: string) => {
    return active_path === decodeURIComponent(path);
  };

  if (!is_mobile_nav_open) {
    return <div></div>;
  }

  return (
    <>
      <div className="mobile-nav-background">
        <button
          className="m-modal-close"
          onClick={() => {
            set_is_mobile_nav_open(false);
          }}
        >
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL + "/img/cancle.svg"}
            alt="modal close button"
          />
        </button>
        <div className="mobile-nav-wrap">
          <ul className="m-menus top">
            <li
              className={isActive("/") ? "m-nav-active" : ""}
              onClick={() => {
                set_is_mobile_nav_open(false);
              }}
            >
              <Link href="/" className="m-menu">
                GALLERY
              </Link>
            </li>
            <li
              className={isActive("/editor") ? "m-nav-active" : ""}
              onClick={() => {
                set_is_mobile_nav_open(false);
              }}
            >
              <Link href="/editor" className="m-menu">
                GENERATOR
              </Link>
            </li>
            <li
              className={isActive("/about") ? "m-nav-active" : ""}
              onClick={() => {
                set_is_mobile_nav_open(false);
              }}
            >
              <Link href="/" className="m-menu">
                ABOUT
              </Link>
            </li>
            {session?.user?.login && (
              <li
                onClick={() => {
                  set_is_mobile_nav_open(false);
                }}
                className={
                  isActive(`/user/${session?.user.nickname}`)
                    ? "m-nav-active"
                    : ""
                }
              >
                <Link
                  href={`/user/${session?.user.nickname}`}
                  className="m-menu"
                >
                  MYPAGE
                </Link>
              </li>
            )}
          </ul>

          <div className="m-navigation_right">
            {session?.user?.login ? (
              <div onClick={() => signOut()}>LOGOUT</div>
            ) : (
              <ul className="m-menus">
                <li
                  onClick={() => signIn("google", { callbackUrl: "/signup" })}
                >
                  LOGIN
                </li>
                <li
                  onClick={() => signIn("google", { callbackUrl: "/signup" })}
                >
                  JOIN
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
