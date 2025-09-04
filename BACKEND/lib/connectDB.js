import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`database is connected : ${conn.connection.host}`);
  } catch (error) {
    console.error("error in connecting db :", error);
    // In serverless context, we cannot send a response here. Let the function fail if needed.
    throw error;
  }
};