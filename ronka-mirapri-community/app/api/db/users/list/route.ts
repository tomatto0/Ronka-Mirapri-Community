import { connectDB, User } from "../../database";
import { NextResponse } from "next/server";
import Hangul from "hangul-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");
  if (keyword === null) {
    return NextResponse.json(
      {
        success: false,
        error: "need to keyword",
      },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const users = await User.aggregate([
      { $sort: { created_at: -1 } },
      { $project: { _id: 0, nickname: 1 } },
    ]);
    const searcher = new Hangul.Searcher(keyword);
    const searched_users = [];
    for (let user of users) {
      if (searcher.search(user.nickname) >= 0) {
        searched_users.push(user);
      }
    }
    return NextResponse.json({ success: true, data: searched_users });
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
