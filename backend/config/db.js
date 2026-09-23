const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("========== MongoDB Connection Failed ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);

    if (error.reason?.servers) {
      console.error("========== SERVER ERRORS ==========");

      for (const [address, server] of error.reason.servers) {
        console.error(`Server: ${address}`);
        console.error("Type:", server.type);
        console.error(
          "Error:",
          server.error?.message || server.error
        );
        console.error("Error name:", server.error?.name);
      }
    }

    console.error("==============================================");

    process.exit(1);
  }
};

module.exports = connectDB;