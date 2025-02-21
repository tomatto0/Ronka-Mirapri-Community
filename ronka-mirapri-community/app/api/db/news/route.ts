import { NextResponse } from "next/server";
import { connectDB, News } from "../database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 5;
  try {
    await connectDB();
    const news = await News.aggregate([
      { $sort: { created_at: -1 } },
      { $limit: limit },
    ]);
    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: news });
  } catch (e) {
    console.error("MongoDB Failed to read news error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 }
    );
  }
}
