process.env.PORT = "3001";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/shipnow_test";
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(30000);
    await mongoose.connect(process.env.MONGODB_URI);
  },

  beforeEach: async function () {
    await mongoose.connection.dropDatabase();
  },

  afterAll: async function () {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
};
