const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { groupPreferenceSchema, GroupPreference, courseProjectSchema, CourseProject, courseStudySchema, CourseStudy, extracurricularSchema, Extracurricular } = require("./preferences");

const UserSchema = new mongoose.Schema({
  profilePic: Buffer,
  name: { type: String, trim: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  gender: { type: String, enum: ["M", "F", "D"] },
  isFullTime: Boolean,
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  nationality: String,
  major: String,
  year: { type: String, enum: ["1", "2", "3", "4", "5"] },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide password"],
  },
  groupPreferences: [groupPreferenceSchema],
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
