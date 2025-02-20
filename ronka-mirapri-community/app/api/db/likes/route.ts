import { connectDB, is_validation_error, Like, User } from "../database";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        { status: 400 }
      );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user.login) {
      return NextResponse.json(
        { success: false, error: "need to login" },
        { status: 404 }
      );
    }
    await connectDB();
    const like = await Like.findOne({
      post: id,
      user: session.user._id,
    }).lean();
    return NextResponse.json({ success: true, data: like });
  } catch (e) {
    console.error("MongoDB Failed to read likes error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user._id) {
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

    const user = await User.findById(session?.user._id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const like_check = await Like.find({
      post: body.post,
      user: session.user._id,
    }).lean();

    if (like_check.length > 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const like = new Like({
      post: body.post,
      user: session.user._id,
    });

    const created_like = await like.save();
    return NextResponse.json({ success: true, data: created_like });
  } catch (e) {
    console.error("MongoDB failed to create likes:", e);
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
    if (!body.post) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const deleted_like = await Like.findOneAndDelete({
      post: body.post,
      user: session.user._id,
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
