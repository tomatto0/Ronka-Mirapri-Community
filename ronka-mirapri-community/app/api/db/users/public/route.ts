import { NextResponse } from "next/server";
import { connectDB, User } from "../../database";

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
    const user = await User.findOne({ nickname: name })
      .select("_id, nickname, sns, posts")
      .lean<{
        _id: string;
        nickname: string;
        sns: string;
        posts: string[];
      }>();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: user,
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
