"use client";

import { NextResponse } from "next/server";

async function like_toggle(post_id: string) {
  try {
    const response = await fetch(`/api/db/likes?id=${post_id}`, {
      method: "GET",
    });
    const res = await response.json();

    if (res.data) {
      const like_response = await fetch(`/api/db/likes`, {
        method: "DELETE",
        body: JSON.stringify({ post: post_id }),
      });
      return like_response;
    } else {
      const like_response = await fetch(`/api/db/likes`, {
        method: "POST",
        body: JSON.stringify({ post: post_id }),
      });
      return like_response;
    }
  } catch (e) {
    console.error("unknown error occured");
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function is_like(post_id: string): Promise<boolean> {
  const response = await fetch(`/api/db/likes?id=${post_id}`, {
    method: "GET",
  });
  const res = await response.json();
  if (res.success === false) {
    return false;
  }
  return res.data !== null;
}

// async function like_count(index: string) {
//   const response = await fetch(`/api/db/posts/index/likes?index=${index}`, {
//     method: "GET",
//   });
//   const res = await response.json();
//   return res.data.like_count;
// }

export { like_toggle, is_like };
