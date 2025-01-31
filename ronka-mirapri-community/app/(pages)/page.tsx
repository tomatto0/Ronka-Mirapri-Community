"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";

type PostInform = {
  _id: string;
  index: number;
  title: string;
  image_url: string;
  like_count: number;
  is_liked: boolean;
};

export default function Page_home() {
  const { data: session, status } = useSession();
  const [posts, set_posts] = useState<PostInform[]>([]);
  const loader = useRef<HTMLDivElement | null>(null);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const is_end = useRef<boolean>(false);

  async function post_fetch(index: number) {
    const response = await fetch(`/api/db/posts/list?index=${index}&size=12`);
    const res = await response.json();
    if (res.success) {
      set_posts([...posts, ...res.data]);
    } else if (res.error === "No more posts") {
      is_end.current = true;
    }
  }
  useEffect(() => {
    post_fetch(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (e) => {
        if (is_end.current || is_loading) {
          return;
        }
        if (e[0].isIntersecting) {
          if (posts && posts.length > 0) {
            console.log("observer work!");
            set_is_loading(true);
            const oldest_index = posts[posts.length - 1].index;
            post_fetch(oldest_index).then(() => {
              set_is_loading(false);
            });
          }
        }
      },
      { threshold: 0 }
    );

    const loader_current = loader.current;
    if (loader_current) {
      observer.observe(loader_current);
    }

    return () => {
      if (loader_current) {
        observer.unobserve(loader_current);
      }
    };
  }, [status, posts]);

  if (status === "loading") {
    return <main></main>;
  }

  return (
    <main>
      {!session?.user.login ? (
        <div>
          <p>You are not signed in</p>
          <button onClick={() => signIn("google", { callbackUrl: "/signup" })}>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {session.user?.nickname}</p>
          <button onClick={() => signOut()}>Sign out</button>
          <div className="post-container">
            {posts.map((post, i) => (
              <PostThumbnail post={post} key={i} />
            ))}
          </div>
          <div ref={loader} className="loader">
            loading
          </div>
        </div>
      )}
    </main>
  );
}
