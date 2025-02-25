import { NextResponse } from "next/server";
import { connectDB, Like, Post, User } from "../../database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 12;
    const session = await getServerSession(authOptions);
    const is_login = session?.user.login;
    connectDB();

    const user = (await User.aggregate([
      { $match: { nickname: name } },
      { $project: { _id: 0, likes: 1 } },
    ])) as { likes: string[] }[];

    const like = await Like.aggregate([
      { $match: { _id: { $in: user[0].likes } } },
      { $project: { _id: 0, post: 1 } },
    ]);
    const post_ids: string[] = [];
    for (let i of like) {
      post_ids.push(i.post);
    }

    // return NextResponse.json(post_ids);

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

    const posts = await Post.aggregate([
      {
        $match: { _id: { $in: post_ids } },
      },
      {
        $addFields: {
          like_count: { $size: "$likes" },
        },
      },
      { $sort: { index: -1 } },
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
