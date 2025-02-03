"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import PostThumbnail from "../components/PostThumbnail";
import FilterSelector from "../components/FilterSelctor";

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
  const [filter, set_filter] = useState<string>("{}");
  const [order, set_order] = useState<string>("최신순");
  const is_end = useRef<boolean>(false);

  async function post_fetch(posts: PostInform[]) {
    console.log(
      `/api/db/posts/list?page=${posts.length}&size=12&filter=${filter}${
        order === "인기순" ? "&order=fav" : ""
      }`
    );
    const response = await fetch(
      `/api/db/posts/list?page=${posts.length}&size=12&filter=${filter}${
        order === "인기순" ? "&order=fav" : ""
      }`
    );
    const res = await response.json();
    if (res.success) {
      set_posts((prev) => [...prev, ...res.data]);
    } else if (res.error === "No more posts") {
      is_end.current = true;
    }
  }
  useEffect(() => {
    set_posts([]);
    is_end.current = false;
    post_fetch([]);
  }, [filter, order]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (e) => {
        if (is_end.current || is_loading) {
          return;
        }
        if (e[0].isIntersecting) {
          if (posts && posts.length > 0) {
            set_is_loading(true);
            post_fetch(posts).then(() => {
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
        </div>
      )}
      <FilterSelector
        set_filter={set_filter}
        order={order}
        set_order={set_order}
      />
      <div className="post-container">
        {posts.map((post, i) => (
          <PostThumbnail post={post} key={i} />
        ))}
      </div>
      <div ref={loader} className="loader">
        {!is_end && "loading"}
      </div>
    </main>
  );
}
