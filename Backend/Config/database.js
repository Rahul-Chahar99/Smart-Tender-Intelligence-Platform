import mongoose from "mongoose";

const DB_NAME = "tender_management_system";
const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("Error", error);
    process.exit(1);
  }
};

export default connectDb;
