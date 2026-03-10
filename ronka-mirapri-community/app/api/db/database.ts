import {
  gender_category,
  job_category,
  race_category,
} from "@/app/utils/constants";
import { Storage } from "@google-cloud/storage";
import { MongoServerError } from "mongodb";
import mongoose, { model, MongooseError, Schema } from "mongoose";
const uri = process.env.MONGODB_URI as string;
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "base64").toString(
    "utf8"
  )
);
const storage = new Storage({ credentials });
const bucketname = "ronka_closet_community";
const bucket = storage.bucket(bucketname);

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
  is_admin: { type: Boolean, default: false },
  warning: [{ type: String, default: [] }],
  created_at: { type: Date, default: Date.now },
});
//user가 findOneAndDelete로 삭제될 때 user _id를 가진 Post, Like를 삭제
user_schema.post("findOneAndDelete", async function (user, next) {
  try {
    if (user) {
      await Post.deleteMany({ author: user._id });
      await Like.deleteMany({ user: user._id });
    }
    next();
  } catch (e) {
    next(e instanceof Error ? e : new Error("Unknown error"));
  }
});

const post_schema = new Schema({
  image_url: { type: String, required: true },
  equiped_item: {
    type: [
      {
        Id: { type: Number, required: true },
        Name: { type: String, default: "" },
        Icon: { type: String, required: true },
        EquipSlotCategory: { type: Number, required: true },
        ClassJobCategory: { type: Number, required: true },
        DyeCount: { type: Number, required: true },
        DyeFirst: { type: Number, required: true },
        DyeSecond: { type: Number, required: true },
      },
    ],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  sns: { type: String, default: "" },
  tag: { type: [String], default: [] },
  gender: { type: String, enum: gender_category, required: true },
  race: { type: String, enum: race_category, required: true },
  job: { type: [String], enum: job_category, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
  index: { type: Number },
  created_at: { type: Date, default: Date.now },
});
post_schema.index({ index: -1 });
//post가 findOneAndDelete로 삭제될 때 post _id를 가진 Like를 삭제, user에서 post를 삭제
post_schema.pre("findOneAndDelete", async function (next) {
  try {
    const post = await this.model
      .findOne(this.getFilter())
      .select(["image_url", "likes", "author", "_id"])
      .lean<{
        image_url: string;
        likes: Schema.Types.ObjectId[];
        author: Schema.Types.ObjectId;
        _id: Schema.Types.ObjectId;
      }>();
    if (!post) {
      return next();
    }
    if (post.likes.length > 0) {
      await Like.deleteMany({ _id: { $in: post.likes } });
    }
    const user = await User.findById(post.author);
    if (user) {
      user.posts.pull(post._id);
      await user.updateOne({ posts: user.posts });
    }
    const filename = post.image_url.replace(`${process.env.NEXT_PUBLIC_CDN_URL}/`, "");

      // 원본 삭제
      const file = bucket.file(filename);
      await file.delete().catch(console.error); 

      // _resized 파일 삭제
      const resizedFilename = filename.replace(".webp", "_resized.webp");
      const resizedFile = bucket.file(resizedFilename);
      await resizedFile.delete().catch(console.error); 
      
    next();
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});
//post가 deleteMany로 삭제될 때 post _id를 가진 Like를 삭제, user에서 post를 삭제
post_schema.pre("deleteMany", async function (next) {
  try {
    const posts = await this.model
      .find({ _id: { $in: this.getFilter()._id } })
      .select(["image_url", "likes", "author", "_id"])
      .lean<{
        image_url: string;
        likes: Schema.Types.ObjectId[];
        author: Schema.Types.ObjectId;
        _id: Schema.Types.ObjectId;
      }>();
    if (!Array.isArray(posts) || posts.length === 0) {
      return next();
    }
    const promise_delete_likes = [];
    const promise_update_user = [];

    for (const post of posts) {
      if (post.likes?.length > 0) {
        promise_delete_likes.push(
          Like.deleteMany({ _id: { $in: post.likes } })
        );
      }
      const user = await User.findById(post.author);
      if (user) {
        user.posts.pull(post._id);
        promise_update_user.push(user.updateOne({ posts: user.posts }));
      }
      const filename = post.image_url.replace(
        `${process.env.NEXT_PUBLIC_CDN_URL}/`,
        ""
      );

      // 원본 삭제
      const file = bucket.file(filename);
      await file.delete().catch(console.error); 

      // _resized 파일 삭제
      const resizedFilename = filename.replace(".webp", "_resized.webp");
      const resizedFile = bucket.file(resizedFilename);
      await resizedFile.delete().catch(console.error); 
    }
    await Promise.all([...promise_delete_likes, ...promise_update_user]);
    next();
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});
post_schema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "post_seq" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.index = counter.seq;
  }
  next();
});
post_schema.post("save", async function (doc) {
  const user = await User.findById(doc.author);
  if (user) {
    user.posts.push(doc._id);
    await user.save();
  }
});

const like_schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});
//like가 findOneAndDelete로 삭제될 때 user와 post에서 like를 삭제
like_schema.pre("findOneAndDelete", async function (next) {
  try {
    const like = await this.model.findOne(this.getFilter()).lean<{
      user: Schema.Types.ObjectId;
      post: Schema.Types.ObjectId;
      _id: Schema.Types.ObjectId;
    }>();
    if (!like) {
      return next();
    }
    const [user, post] = await Promise.all([
      User.findById(like.user),
      Post.findById(like.post),
    ]);
    if (user) {
      user.likes.pull(like._id);
      await user.updateOne({ likes: user.likes });
    }
    if (post) {
      post.likes.pull(like._id);
      await post.updateOne({ likes: post.likes });
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
//like가 deleteMany로 삭제될 때 user와 post에서 like를 삭제
like_schema.pre("deleteMany", async function (next) {
  try {
    console.log("like-schema.deleteMany", this.getFilter());
    const likes = await this.model
      .find(this.getFilter())
      .select(["user", "post", "_id"])
      .lean<
        {
          user: Schema.Types.ObjectId;
          post: Schema.Types.ObjectId;
          _id: Schema.Types.ObjectId;
        }[]
      >();
    if (!Array.isArray(likes) || likes.length === 0) {
      return next();
    }
    const promise_update_post = [];
    const promise_update_user = [];

    for (const like of likes) {
      const user = await User.findById(like.user);
      if (user) {
        user.likes.pull(like._id);
        promise_update_user.push(user.updateOne({ likes: user.likes }));
      }
      const post = await Post.findById(like.post);
      if (post) {
        post.likes.pull(like._id);
        promise_update_post.push(post.updateOne({ likes: post.likes }));
      }
    }
    await Promise.all([...promise_update_post, ...promise_update_user]);
    next();
  } catch (e) {
    if (e instanceof Error) {
      next(e);
    } else {
      next(new Error("Unknown error"));
    }
  }
});
like_schema.post("save", async function (doc) {
  const post = await Post.findById(doc.post);
  if (post) {
    post.likes.push(doc._id);
    await post.save();
  }
  const user = await User.findById(doc.user);
  if (user) {
    user.likes.push(doc._id);
    await user.save();
  }
});

const counter_schema = new Schema({
  _id: { type: String },
  seq: { type: Number },
});

const blacklist_schema = new Schema({
  email: { type: String, required: true, unique: true },
});

const news_schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || model("User", user_schema);
const Post = mongoose.models.Post || model("Post", post_schema);
const Like = mongoose.models.Like || model("Like", like_schema);
const Counter = mongoose.models.Counter || model("Counter", counter_schema);
const Blacklist =
  mongoose.models.Blacklist || model("Blacklist", blacklist_schema);
const News = mongoose.models.News || model("News", news_schema);

export {
  connectDB,
  is_duplicated_error,
  is_validation_error,
  User,
  Post,
  Like,
  Blacklist,
  News,
};
