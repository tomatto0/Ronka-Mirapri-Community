import { NextResponse } from "next/server";
import { connectDB, Post } from "../../database";

// 특정 index 값을 가진 단일 게시물을 조회
// 기본 정보, 작성자 닉네임, 좋아요 개수 및 사용자 좋아요 여부를 함께 반환

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

    // 특정 index 값을 가진 게시물 1건 조회 (likes 필드는 제외)
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

    // 게시물 정보와 좋아요 개수를 합쳐서 응답 반환
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
