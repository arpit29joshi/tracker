import mongoose, { Connection } from "mongoose";
let cachedConnection: Connection | null = null; //to not create new connection ever time
export async function connect() {
  if (cachedConnection) {
    console.log("using cachedConnection");
    return cachedConnection;
  }
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL!);
    cachedConnection = connection.connection;
    console.log("New mongoDB connection established");
    cachedConnection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    cachedConnection.on("error", (error) => {
      console.log("MongoDB connection error: ", error);
      process.exit();
    });
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
