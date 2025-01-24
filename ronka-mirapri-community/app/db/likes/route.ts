import { connectDB, is_validation_error, Like } from "../database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, error: "Need to login" },
        { status: 400 }
      );
    }
    if (!body.post) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();

    const like = new Like({
      post: body.post,
      user: session.user._id,
    });

    const created_like = await like.save();
    return NextResponse.json({ success: true, data: created_like });
  } catch (e) {
    console.error("MongoDB failed to create posts:", e);
    let error_message = "Unknown error";
    if (is_validation_error(e)) {
      error_message = "Validation Error";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create posts: " + error_message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, error: "Need to login" },
        { status: 400 }
      );
    }
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const deleted_like = await Like.findOneAndDelete({
      _id: body.id,
      author: session.user._id,
    }).exec();
    if (!deleted_like) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deleted_like });
  } catch (e) {
    console.error("MongoDB Failed to delete posts:", e);
    return NextResponse.json(
      { success: false, error: "Unknown Error" },
      { status: 500 }
    );
  }
}
