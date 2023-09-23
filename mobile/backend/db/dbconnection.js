const mongoose = require("mongoose");
require("dotenv").config();

const DBconnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://root:0IF1tq3iWhsQgkCF@testing.9cyacsg.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("db connected");
  } catch (error) {
    console.log("db connection failed");
  }
};
module.exports = { DBconnection };
