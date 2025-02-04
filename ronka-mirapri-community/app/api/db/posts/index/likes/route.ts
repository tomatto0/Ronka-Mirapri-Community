import { NextResponse } from "next/server";
import { connectDB, Like, Post } from "../../../database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const index = Number(url.searchParams.get("index"));
    if (!index) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const post = await Post.aggregate([
      { $match: { index: index } },
      { $project: { _id: 1, like_count: { $size: "$likes" } } },
    ]);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    let is_liked = false;
    const session = await getServerSession(authOptions);
    if (session?.user.login) {
      const like = await Like.findOne({
        post: post[0]._id,
        user: session.user._id,
      }).lean();
      is_liked = like !== null;
    }

    return NextResponse.json({ success: true, data: { ...post[0], is_liked } });
  } catch (e) {
    console.error("MongoDB Failed to read posts error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
