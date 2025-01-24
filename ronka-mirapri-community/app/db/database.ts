import { MongoServerError } from "mongodb";
import mongoose, { model, MongooseError, Schema } from "mongoose";
const uri = process.env.MONGODB_URI as string;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB connection complete");
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}

function is_duplicated_error(e: unknown): e is MongoServerError {
  return e instanceof MongoServerError && e.code === 11000;
}

function is_validation_error(e: unknown): e is MongooseError {
  return e instanceof MongooseError && e.name === "ValidationError";
}

const user_schema = new Schema({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  sns: { type: String, default: "" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
  created_at: { type: Date, default: Date.now },
});
//user가 findOneAndDelete로 삭제될 때 user _id를 가진 Post, Like를 삭제
user_schema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await Post.deleteMany({ author: user._id });
      await Like.deleteMany({ user: user._id });
    }
    next();
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});

const post_schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
  created_at: { type: Date, default: Date.now },
});
//post가 findOneAndDelete로 삭제될 때 post _id를 가진 Like를 삭제
post_schema.pre("findOneAndDelete", async function (next) {
  try {
    const post = await this.model
      .findOne(this.getFilter())
      .select("likes")
      .lean<{ likes: Schema.Types.ObjectId[] }>();
    if (post && post.likes?.length > 0) {
      await Like.deleteMany({ _id: { $in: post.likes } });
    }
    next();
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});
//post가 deleteMany로 삭제될 때 post _id를 가진 Like를 삭제
post_schema.pre("deleteMany", async function (next) {
  try {
    const post_ids = this.getFilter()._id;
    const posts = await this.model
      .find({ _id: { $in: post_ids } })
      .select("likes");
    const like_ids = posts.flatMap((post) => post.likes);
    await Like.deleteMany({ _id: { $in: like_ids } });
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});

const like_schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.models.User || model("User", user_schema);
const Post = mongoose.models.Post || model("Post", post_schema);
const Like = mongoose.models.Like || model("Like", like_schema);

export {
  connectDB,
  is_duplicated_error,
  is_validation_error,
  User,
  Post,
  Like,
};
