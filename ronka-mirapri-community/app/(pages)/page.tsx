"use client";

import "../css/home.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { is_like, like_toggle } from "../utils/clientfunction";

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

  const PostThumbnail = ({ post }: { post: PostInform }) => {
    const [is_liked, set_is_liked] = useState<boolean>(post.is_liked);
    const like_handler = async () => {
      await like_toggle(post._id);
      set_is_liked(await is_like(post._id));
    };

    const post_click_handler = () => {
      window.location.href = `/post/${post.index}`;
    };

    return (
      <div className="post-box">
        <img
          className="post-thumbnail"
          src={post.image_url}
          alt={post.title}
          onClick={post_click_handler}
        />
        <div>
          <p>{post.title}</p>
          <button onClick={like_handler}>{is_liked ? "O" : "X"}</button>
        </div>
      </div>
    );
  };

  async function post_fetch(index: number) {
    const response = await fetch(`/api/db/posts/list?index=${index}&size=12`);
    const res = await response.json();
    if (res.success) {
      set_posts([...posts, ...res.data]);
    } else if (res.error === "No more posts") {
      console.log(is_end.current);
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
            {is_end ? "end" : "not end"}
          </div>
        </div>
      )}
    </main>
  );
}
