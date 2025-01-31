import { NextResponse } from "next/server";
import { connectDB, Like, Post } from "../../database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const index = Number(url.searchParams.get("index")) || 0;
    const size = Number(url.searchParams.get("size")) || 12;

    const session = await getServerSession(authOptions);
    const is_login = session?.user.login;
    connectDB();

    function response_handler(post: any[]) {
      if (!post || post.length == 0) {
        return NextResponse.json({ success: false, error: "No more posts" });
      }
      return NextResponse.json({ success: true, data: post });
    }

    if (!index) {
      const posts = await Post.aggregate([
        { $sort: { index: -1 } },
        { $limit: size },
        {
          $project: {
            index: 1,
            title: 1,
            image_url: 1,
            like_count: { $size: "$likes" },
          },
        },
      ]);
      if (is_login) {
        for (let post of posts) {
          const like = await Like.findOne({
            post: post._id,
            user: session.user._id,
          }).lean();
          post.is_liked = like !== null;
        }
      } else {
        for (let post of posts) {
          post.is_liked = false;
        }
      }
      return response_handler(posts);
    } else {
      const posts = await Post.aggregate([
        { $match: { index: { $lt: index } } },
        { $sort: { index: -1 } },
        { $limit: size },
        {
          $project: {
            index: 1,
            title: 1,
            image_url: 1,
            like_count: { $size: "$likes" },
          },
        },
      ]);
      return response_handler(posts);
    }
  } catch (e) {
    return NextResponse.json({ success: false });
  }
}
