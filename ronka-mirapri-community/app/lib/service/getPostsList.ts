// app/lib/services/getPostsList.ts
import { connectDB, Like, Post } from "@/app/api/db/database";
import type { Session } from "next-auth";

export const getPostsList = async (
  page: number,
  size: number,
  filter: object,
  order: boolean,
  session: Session | null,
) => {
  await connectDB();

  const posts = await Post.aggregate([
    { $match: { $and: [{ index: { $gte: 1 } }, filter] } },
    { $addFields: { like_count: { $size: "$likes" } } },
    { $sort: order ? { like_count: -1 } : { index: -1 } },
    { $skip: page },
    { $limit: size },
    { $project: { index: 1, title: 1, image_url: 1, like_count: 1 } },
  ]);

  if (session?.user.login) {
    for (const post of posts) {
      const like = await Like.findOne({
        post: post._id,
        user: session.user._id,
      }).lean();
      post.is_liked = like !== null;
    }
  } else {
    for (const post of posts) {
      post.is_liked = false;
    }
  }

  if (!posts || posts.length === 0) {
    return { success: false, error: "No more posts" };
  }

  const plain_posts = JSON.parse(JSON.stringify(posts));
  return { success: true, data: plain_posts };
};
