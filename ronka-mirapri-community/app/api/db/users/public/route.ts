import { NextResponse } from "next/server";
import { connectDB, Post, User } from "../../database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  try {
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await User.aggregate([
      { $match: { nickname: name } },
      { $project: { _id: 0, nickname: 1, sns: 1, posts: 1 } },
    ]);
    const posts = await Post.aggregate([
      { $match: { _id: { $in: user[0].posts } } },
      { $addFields: { like_count: { $size: "$likes" } } },
      { $project: { _id: 0, like_count: 1 } },
    ]);
    let like_count = 0;
    for (let post of posts) {
      like_count += post.like_count;
    }
    const { posts: _, ...return_users } = user[0];
    console.log(return_users);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: { ...return_users, like_count },
    });
  } catch (e) {
    console.error("MongoDB Failed to read users error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
