"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type PostInform = {
  _id: string;
  index: number;
  title: string;
  image_url: string;
  like_count: number;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [posts, set_posts] = useState<PostInform[]>([]);
  const loader = useRef<HTMLDivElement | null>(null);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const is_end = useRef<boolean>(false);

  const PostThumbnail = ({ post }: { post: PostInform }) => {
    return (
      <div className="post-box">
        <img className="post-thumbnail" src={post.image_url} alt={post.title} />
      </div>
    );
  };

  async function post_fetch(index: number) {
    const response = await fetch(`/api/db/posts/list?index=${index}&size=12`);
    const res = await response.json();
    if (res.success) {
      set_posts([...posts, ...res.data]);
    } else {
      is_end.current = true;
    }
  }
  useEffect(() => {
    post_fetch(0);
  }, []);

  useEffect(() => {
    console.log(loader.current);
    const observer = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !is_loading) {
          set_is_loading(true);

          console.log("observer work");
          set_is_loading(false);
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
  }, [loader.current]);

  if (status === "loading") {
    return;
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
          <div
            ref={loader}
            onClick={() => {
              console.log(loader.current);
            }}
            className="loader"
          >
            loading
          </div>
        </div>
      )}
    </main>
  );
}
