import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB, User } from "../../database";

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
    const user = await User.findById(id).lean<{
      _id: String;
      nickname: String;
      sns: String;
    }>();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        sns: user.sns,
      },
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
