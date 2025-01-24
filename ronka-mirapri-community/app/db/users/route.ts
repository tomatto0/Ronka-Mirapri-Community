import mongoose from "mongoose";
import {
  connectDB,
  is_duplicated_error,
  is_validation_error,
  User,
} from "../database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const session = await getServerSession(authOptions);

  try {
    if (email && session?.user?.email !== email) {
      throw new Error("not valid email");
    }
    await connectDB();
    const users = await User.findOne({ email }).exec();
    if (!users) {
      return NextResponse.json({ success: false, error: "User not found." });
    }
    return NextResponse.json({ success: true, data: users });
  } catch (e) {
    console.error("MongoDB Failed to read users error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (session?.user?.email !== body.email) {
      throw new Error("not valid email");
    }
    const user = new User({
      email: body.email,
      nickname: body.nickname,
      sns: body.sns,
    });
    const created_user = await user.save();

    return NextResponse.json({ success: true, data: created_user });
  } catch (e) {
    console.error("MongoDB Failed to create users:");
    let error_message: string = "";

    if (is_duplicated_error(e)) {
      console.log("duplicated Error", e);
      error_message = "duplicated Error";
    } else if (is_validation_error(e)) {
      console.log("validation Error");
      error_message = "validation Error";
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create users: " + error_message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (session?.user?.email !== body.email) {
      throw new Error("not valid email");
    }

    for (const field of ["email"]) {
      if (!body[field]) {
        const error = new mongoose.Error.ValidationError();
        error.addError(
          field,
          new mongoose.Error.ValidatorError({
            message: `${field} is required`,
          })
        );
        throw error;
      }
    }

    const updated_user = await User.findOneAndUpdate(
      { email: body.email },
      {
        email: body.email,
        nickname: body.nickname,
        sns: body.sns,
      },
      { new: true, runValidators: true }
    ).exec();
    if (!updated_user) {
      return NextResponse.json(
        { sucess: false, error: "user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated_user });
  } catch (e) {
    console.error("MongoDB Failed to update users:");
    let error_message: string = "unknown error";
    if (is_duplicated_error(e)) {
      error_message = "duplicated Error: This email is already use";
    } else if (is_validation_error(e)) {
      error_message = "validation Error: one or more field is needs";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update users: " + error_message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (session?.user?.email !== body.email) {
      throw new Error("not valid email");
    }

    for (const field of ["email"]) {
      if (!body[field]) {
        const error = new mongoose.Error.ValidationError();
        error.addError(
          field,
          new mongoose.Error.ValidatorError({
            message: `${field} is required`,
          })
        );
        throw error;
      }
    }

    const deleted_user = await User.findOneAndDelete({
      email: body.email,
    }).exec();

    if (!deleted_user) {
      return NextResponse.json(
        { sucess: false, error: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deleted_user });
  } catch (e) {
    console.error("MongoDB Failed to delete users:");
    let error_message: string = "unknown error";
    if (is_validation_error(e)) {
      error_message = "validation Error: one or more field is needs";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete users: " + error_message,
      },
      { status: 500 }
    );
  }
}
