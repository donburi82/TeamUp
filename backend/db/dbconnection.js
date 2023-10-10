const mongoose = require("mongoose");

const DBconnection = async (MongoURI) => {
  try {
    await mongoose.connect(MongoURI);
    console.log("db connected");
  } catch (error) {
    console.log("db connection failed");
  }
};
module.exports = { DBconnection };
