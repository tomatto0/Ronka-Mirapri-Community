import { connectDB, is_validation_error, Post, User } from "../database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import post_validate from "@/app/utils/post_validate";

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

    const { is_validate, ...post_message } = post_validate(
      body.image_url,
      body.equiped_item,
      body
    );

    if (!is_validate) {
      return NextResponse.json({ success: false, error: post_message });
    }

    await connectDB();

    const user = await User.findById(session?.user._id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

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

    const { is_validate, ...post_message } = post_validate(
      body.image_url,
      body.equiped_item,
      body
    );
    if (!is_validate) {
      return NextResponse.json({ success: false, error: post_message });
    }

    await connectDB();

    const { id: _, ...update_field } = body;

    const post = await Post.findOne({
      _id: body.id,
    }).exec();

    if (!post) {
      return NextResponse.json(
        { sucess: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author !== session.user._id || !session.user.is_admin) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const updated_post = await Post.findOneAndUpdate(
      {
        _id: body.id,
      },
      update_field,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

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

    const post = await Post.findOne({
      _id: body.id,
    }).exec();

    console.log(post);

    if (!post) {
      return NextResponse.json(
        { sucess: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author !== session.user._id || !session.user.is_admin) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const deleted_post = await Post.findOneAndDelete({
      _id: body.id,
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
