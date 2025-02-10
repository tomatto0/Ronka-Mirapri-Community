import { NextResponse } from "next/server";
import { connectDB, Like, Post } from "../../database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 조건에 맞는 다중 게시물 조회
export async function GET(request: Request) {
  try {
    // 요청 URL을 파싱하여 필요한 정보를 추출
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 12;
    const filter = JSON.parse(url.searchParams.get("filter") ?? "[]");
    const order = url.searchParams.get("order") === "fav";

    // 현재 로그인된 사용자 세션 정보 가져오기
    const session = await getServerSession(authOptions);
    const is_login = session?.user.login;

    connectDB();

    // 로그인 여부에 따른 is_liked 값 설정
    async function response_handler(posts: any[]) {
      if (is_login) {
        for (let post of posts) {
          const like = await Like.findOne({
            post: post._id,
            user: session.user._id,
          }).lean();
          post.is_liked = like !== null;
        }
      } else {
        for (let post of posts) {
          post.is_liked = false;
        }
      }
      if (!posts || posts.length == 0) {
        return NextResponse.json({ success: false, error: "No more posts" });
      }
      return NextResponse.json({ success: true, data: posts });
    }

    // MongoDB Aggregation을 사용하여 게시물 조회 및 필터링
    const posts = await Post.aggregate([
      {
        $match: {
          $and: [{ index: { $gte: 1 } }, filter],
        },
      },
      {
        $addFields: {
          like_count: { $size: "$likes" },
        },
      },
      { $sort: order ? { like_count: -1 } : { index: -1 } },
      { $skip: page },
      { $limit: size },
      {
        $project: {
          index: 1,
          title: 1,
          image_url: 1,
          like_count: 1,
        },
      },
    ]);
    return await response_handler(posts);
  } catch (e) {
    return NextResponse.json({ success: false, error: e });
  }
}
