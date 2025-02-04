import { NextResponse } from "next/server";
import { connectDB, Like, Post } from "../../database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const index = url.searchParams.get("index");

  try {
    if (!index) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const post = await Post.findOne({ index: index })
      .select("-likes")
      .populate("author", "nickname")
      .lean<{ _id: string }>();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const post_like = await Post.findOne({ index: index })
      .select({ like_count: { $size: "$likes" } })
      .lean();

    return NextResponse.json({
      success: true,
      data: { ...post, ...post_like },
    });
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
