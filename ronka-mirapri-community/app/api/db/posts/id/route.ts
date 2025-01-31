import { NextResponse } from "next/server";
import { connectDB, Post } from "../../database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const post = await Post.findById(id).populate("author", "nickname").lean();
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: post });
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
