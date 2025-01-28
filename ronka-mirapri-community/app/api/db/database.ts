import {
  gender_category,
  job_category,
  race_category,
} from "@/app/utils/constants";
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
//post가 findOneAndDelete로 삭제될 때 post _id를 가진 Like를 삭제
post_schema.pre("findOneAndDelete", async function (next) {
  try {
    const post = await this.model
      .findOne(this.getFilter())
      .select(["likes", "author", "_id"])
      .lean<{
        likes: Schema.Types.ObjectId[];
        author: Schema.Types.ObjectId;
        _id: Schema.Types.ObjectId;
      }>();
    if (!post) {
      return next();
    }
    if (post.likes?.length > 0) {
      await Like.deleteMany({ _id: { $in: post.likes } });
    }
    const user = await User.findById(post.author);
    if (user) {
      user.posts.pull(post._id);
      await user.updateOne({ posts: user.posts });
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
    const posts = await this.model
      .find({ _id: { $in: this.getFilter()._id } })
      .select(["likes", "author", "_id"])
      .lean<
        {
          likes: Schema.Types.ObjectId[];
          author: Schema.Types.ObjectId;
          _id: Schema.Types.ObjectId;
        }[]
      >();
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
like_schema.pre("findOneAndDelete", async function (next) {
  try {
    const like = await this.model.findOne(this.getFilter()).lean<{
      user: Schema.Types.ObjectId;
      post: Schema.Types.ObjectId;
      _id: Schema.Types.ObjectId;
    }>();
    if (!like) {
      console.log("like not found");
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

const User = mongoose.models.User || model("User", user_schema);
const Post = mongoose.models.Post || model("Post", post_schema);
const Like = mongoose.models.Like || model("Like", like_schema);
const Counter = mongoose.models.Counter || model("Counter", counter_schema);

export {
  connectDB,
  is_duplicated_error,
  is_validation_error,
  User,
  Post,
  Like,
};
