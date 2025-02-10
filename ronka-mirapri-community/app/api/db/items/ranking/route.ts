import { NextResponse } from "next/server";
import { connectDB, Post, User } from "../../database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 10;
  try {
    await connectDB();
    const week_ago = new Date();
    week_ago.setDate(week_ago.getDate() - 30);
    const post = (await Post.aggregate([
      { $match: { created_at: { $gte: week_ago } } },
      {
        $project: {
          _id: 0,
          items: {
            $map: {
              input: "$equiped_item",
              as: "item",
              in: { name: "$$item.Name" },
            },
          },
          like_count: { $size: "$likes" },
        },
      },
    ])) as { items: { id: number; name: string }[]; like_count: number }[];
    const rank: { [key: string]: number } = {};
    for (let items of post) {
      for (let item of items.items) {
        if (item.name === "") {
          continue;
        }
        if (item.name in rank) {
          rank[item.name] += 1 + items.like_count;
        } else {
          rank[item.name] = 1 + items.like_count;
        }
      }
    }
    const sorted_rank = Object.entries(rank).sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      } else {
        return a[0].localeCompare(b[0]);
      }
    });
    return NextResponse.json({
      success: true,
      data: sorted_rank.slice(0, limit),
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
