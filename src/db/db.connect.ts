import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.URL_DB}/social-app`);
    console.log("✅ Database contacted");
  } catch (error) {
    console.log("❌ Database connection failed");
  }
};
