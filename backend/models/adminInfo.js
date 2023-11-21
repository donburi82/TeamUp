const mongoose = require("mongoose");

const AdminInfoSchema = new mongoose.Schema({
  WhiteListEmailDomain: [String],
  courseList: [String],
});

const AdminInfo = mongoose.model("adminInfo", AdminInfoSchema);
module.exports = AdminInfo;
