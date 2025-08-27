import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri: any = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI not defined in .env");
}

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
