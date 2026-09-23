const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("========== MongoDB Connection Failed ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Reason:", error.reason);
    console.error("Cause:", error.cause);
    console.error("================================================");

    process.exit(1);
  }
};

module.exports = connectDB;