import { getServerSession } from "next-auth";
import { connectDB, User } from "../../database";
import { authOptions } from "@/app/utils/authOptions";
import { NextResponse } from "next/server";

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
    const session = await getServerSession(authOptions);
    if (!session?.user.is_admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden access" },
        { status: 403 }
      );
    }
    await connectDB();
    const user = await User.aggregate([
      { $match: { nickname: name } },
      {
        $project: {
          warning: 1,
        },
      },
    ]);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: user[0],
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

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user.is_admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden access" },
        { status: 403 }
      );
    }
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const updated_user = await User.findByIdAndUpdate(
      body.id,
      { $push: { warning: body.warning } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
    if (!updated_user) {
      return NextResponse.json(
        { sucess: false, error: "user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated_user });
  } catch (e) {
    console.error("MongoDB Failed to update users:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
