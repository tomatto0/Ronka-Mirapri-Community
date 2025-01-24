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
  sns: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || model("User", user_schema);

export { connectDB, is_duplicated_error, is_validation_error, User };
