const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  groupPreferenceSchema,
  GroupPreference,
  CourseProject,
  CourseStudy,
  Extracurricular,
} = require("./preferences");

const UserSchema = new mongoose.Schema({
  profilePic: { data: Buffer, contentType: String },
  name: { type: String, trim: true, default: "anonymous" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  gender: { type: String, enum: ["M", "F"] },
  isFullTime: { type: Boolean, default: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  nationality: String,
  major: String,
  year: { type: String, enum: [1, 2, 3, 4, 5], default: 1 },
  password: {
    type: String,
    required: [true, "Please provide password"],
    match: [
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
      "Password should contain at least 8 character, one number, one lowercase and one uppercase letter",
    ],
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
