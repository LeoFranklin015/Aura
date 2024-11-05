import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export const connectToDb = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || "");
    await client.connect();
    return client.db("Aura");
  } catch (error) {
    console.log(error);
  }
};
