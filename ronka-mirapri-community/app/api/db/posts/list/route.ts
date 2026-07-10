// app/api/db/posts/list/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { getPostsList } from "@/app/lib/service/getPostsList";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 12;
    const filter = JSON.parse(url.searchParams.get("filter") ?? "[]");
    const order = url.searchParams.get("order") === "fav";

    const session = await getServerSession(authOptions);
    const result = await getPostsList(page, size, filter, order, session);

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ success: false, error: e });
  }
}
