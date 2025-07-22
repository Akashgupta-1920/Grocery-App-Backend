import mongoose from "mongoose";

export const connectDB = async(url) => {
  try{
    await mongoose.connect(url)
    console.log("DB is Connected");
  } catch (error) {
    console.log("Database connection error: " , error)
  }
}