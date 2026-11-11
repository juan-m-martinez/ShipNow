const mongoose = require("mongoose");
const config = require("./env.config");

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
