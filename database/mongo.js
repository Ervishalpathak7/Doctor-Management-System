import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect(process.env.Mongo_uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Properly exit the process in case of an error
  }
}

export default connect;
