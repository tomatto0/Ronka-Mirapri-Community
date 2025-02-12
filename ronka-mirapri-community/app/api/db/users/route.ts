import {
  connectDB,
  is_duplicated_error,
  is_validation_error,
  User,
} from "../database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cursed_word_check from "@/app/utils/cursed_word_check";
import nickname_check from "@/app/utils/nickname_check";

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
    const session = await getServerSession(authOptions);
    if (session?.user._id !== id) {
      return NextResponse.json(
        { success: false, error: "Forbidden access" },
        { status: 403 }
      );
    }
    await connectDB();
    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user });
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

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const user_message = {
      is_invalid: false,
      email_message: "",
      nickname_message: "",
      sns_message: "",
    };
    if (session?.user?.email !== body.email) {
      user_message.is_invalid = true;
      user_message.email_message =
        "유효하지 않은 이메일입니다. 처음부터 다시 시도해주세요.";
    }
    user_message.nickname_message = nickname_check(body.nickname);
    if (user_message.nickname_message !== "") {
      user_message.is_invalid = true;
    }
    if (cursed_word_check(body.sns)) {
      user_message.is_invalid = true;
      user_message.sns_message =
        "SNS에 부적절한 단어가 포함되어있습니다. 부적절한 내용을 작성할 경우 통보없이 수정, 탈퇴처리 될 수 있습니다.";
    }
    if (user_message.is_invalid) {
      return NextResponse.json({ success: false, error: user_message });
    }

    const user = new User({
      email: body.email,
      nickname: body.nickname,
      sns: body.sns,
    });
    const created_user = await user.save();

    return NextResponse.json({ success: true, data: created_user });
  } catch (e) {
    console.error("MongoDB Failed to create users:", e);
    let error_message = "Unknown error";
    if (is_duplicated_error(e)) {
      error_message = "duplicated Error";
    } else if (is_validation_error(e)) {
      error_message = "validation Error";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: error_message,
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
    if (!body.id || session?.user?._id !== body.id) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    await connectDB();

    const update_field: Partial<{ nickname: string; sns: string }> = {};

    const keys: (keyof typeof update_field)[] = ["nickname", "sns"];
    keys.forEach(key => {
      if (body[key] !== undefined) {
        update_field[key] = body[key];
      }
    });

    const updated_user = await User.findByIdAndUpdate(body.id, update_field, {
      new: true,
      runValidators: true,
    }).exec();
    if (!updated_user) {
      return NextResponse.json(
        { sucess: false, error: "user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated_user });
  } catch (e) {
    console.error("MongoDB Failed to update users:", e);
    let error_message = "Unknown error";
    if (is_duplicated_error(e)) {
      error_message = "duplicated Error";
    } else if (is_validation_error(e)) {
      error_message = "validation Error";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: error_message,
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
    if (!body.id || session?.user?._id !== body.id) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted_user = await User.findOneAndDelete({ _id: body.id }).exec();

    if (!deleted_user) {
      return NextResponse.json(
        { success: false, error: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deleted_user });
  } catch (e) {
    console.error("MongoDB Failed to delete users:", e);
    let error_message: string = "unknown error";
    if (is_validation_error(e)) {
      error_message = "validation Error";
    }
    console.log(error_message);
    return NextResponse.json(
      {
        success: false,
        error: error_message,
      },
      { status: 500 }
    );
  }
}
