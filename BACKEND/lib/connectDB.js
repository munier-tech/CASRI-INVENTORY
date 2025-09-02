import mongoose from "mongoose";


export const connectdb = async (req, res) => {
 try {
  const conn = await mongoose.connect(process.env.MONGO_DB_URL);
  console.log(`database is connected : ${conn.connection.host}`);

 } catch (error) {
   console.error("error in connecting db : " , error);
   res.status(500).json({ message : error.message})
 }
}