import { getServerSession } from "next-auth";
import { Blacklist, connectDB } from "../database";
import { authOptions } from "@/app/utils/authOptions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    const blacklist = new Blacklist({
      email: body.email,
    });
    const created_blacklist = await blacklist.save();
    return NextResponse.json({ success: true, data: created_blacklist });
  } catch (e) {
    console.error("MongoDB Failed to create blacklists:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
