process.env.PORT = "3001";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/shipnow_test";
process.env.NODE_ENV = "test";

const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const testUploadsDirectory = path.resolve(__dirname, "../.test-uploads");
process.env.UPLOADS_DIR = testUploadsDirectory;

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(30000);
    fs.rmSync(testUploadsDirectory, { recursive: true, force: true });
    await mongoose.connect(process.env.MONGODB_URI);
  },

  beforeEach: async function () {
    await mongoose.connection.dropDatabase();
  },

  afterAll: async function () {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
      }
    } finally {
      try {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
      } finally {
        fs.rmSync(testUploadsDirectory, { recursive: true, force: true });
      }
    }
  },
};
