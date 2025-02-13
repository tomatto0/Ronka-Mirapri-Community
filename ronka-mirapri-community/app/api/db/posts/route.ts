import { connectDB, is_validation_error, Post } from "../database";
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
    if (!body.title && !body.content) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    await connectDB();
    const post = new Post({
      ...body,
      author: session.user._id,
    });

    const created_post = await post.save();
    return NextResponse.json({ success: true, data: created_post });
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

export async function PATCH(request: Request) {
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

    const update_field: Partial<{
      title: string;
      content: string;
      tags: string[];
    }> = {};

    const keys: (keyof typeof update_field)[] = ["title", "content", "tags"];
    keys.forEach(key => {
      if (body[key] !== undefined) {
        update_field[key] = body[key];
      }
    });

    const updated_post = await Post.findOneAndUpdate(
      {
        _id: body.id,
        author: session.user._id,
      },
      update_field,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!updated_post) {
      return NextResponse.json(
        { sucess: false, error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated_post });
  } catch (e) {
    console.error("MongoDB Failed to update posts", e);
    return NextResponse.json(
      { success: false, error: "Unknown Error" },
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
    const deleted_post = await Post.findOneAndDelete({
      _id: body.id,
      author: session.user._id,
    }).exec();
    if (!deleted_post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deleted_post });
  } catch (e) {
    console.error("MongoDB Failed to delete posts:", e);
    return NextResponse.json(
      { success: false, error: "Unknown Error" },
      { status: 500 }
    );
  }
}
