const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId;

// Schemas for Group Preference Information
const groupPreferenceSchema = new mongoose.Schema({});
const GroupPreference = mongoose.model(
  "GroupPreference",
  groupPreferenceSchema
);

const courseProjectSchema = new mongoose.Schema({
  courseCode: String,
  projectInterest: String,
  skillset: [String],
  targetGrade: {
    type: String,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: "A+",
  },
  experience: String,
});

const courseStudySchema = new mongoose.Schema({
  courseCode: String,
  targetGrade: {
    type: String,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: "A+",
  },
  preferredLanguage: String,
});

const extracurricularSchema = new mongoose.Schema({
  projectInterest: String,
  skillset: [String],
  experience: String,
  preferredLanguage: String,
});

const CourseProject = GroupPreference.discriminator(
  "CourseProject",
  courseProjectSchema
);
const CourseStudy = GroupPreference.discriminator(
  "CourseStudy",
  courseStudySchema
);
const Extracurricular = GroupPreference.discriminator(
  "Extracurricular",
  extracurricularSchema
);

// User Schema
const UserSchema = new mongoose.Schema({
  profilePic: { data: Buffer, contentType: String },
  name: { type: String, trim: true, default: "anonymous" },
  isAdmin: { type: Boolean, default: false },
  gender: { type: String, enum: ["M", "F"] },
  isFullTime: { type: Boolean, default: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  nationality: String,
  major: [String],
  year: { type: String, enum: [1, 2, 3, 4, 5], default: 1 },
  password: {
    type: String,
    required: [true, "Please provide password"],
    // temporarily removed
    // match: [
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
    //   "Password should contain at least 8 character, one number, one lowercase and one uppercase letter",
    // ],
  },
  // for group preference & matching
  groupPreferences: [groupPreferenceSchema],
  // // single array for matches - need to discuss (problem with deletion)
  // needRematch: { type: Boolean, default: true },
  // matches: [ObjectId],
  // temporary solution - one for each category
  courseProjectRematch: { type: Boolean, default: true },
  courseProjectMatches: [ObjectId],
  // for chat
  socketId: String,
});

// might need to refactor the methods to helpers
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

// Export Models
module.exports = {
  User: User,
  groupPreferenceSchema: groupPreferenceSchema,
  GroupPreference: GroupPreference,
  CourseProject: CourseProject,
  CourseStudy: CourseStudy,
  Extracurricular: Extracurricular,
};
