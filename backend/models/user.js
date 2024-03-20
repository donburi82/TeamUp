const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

// Word Count Validator
const wordCountValidator = [

  {
    validator: function(s) {
      const words = s.split(/\s+/).filter(Boolean);
      console.log(words.length);
      return words.length <= 20;
    },
    message: "The field cannot contain more than 20 words.",
  }

];

// Schemas for Group Preference Information
const groupPreferenceSchema = new mongoose.Schema({});
const GroupPreference = mongoose.model(
  "GroupPreference",
  groupPreferenceSchema
);

const courseProjectSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  semester: { type: String, required: true },
  projectInterest: {
    type: String,
    required: true,
    validate: wordCountValidator,
  },
  skillset: { type: [String], required: true },
  targetGrade: {
    type: String,
    required: true,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: "A+",
  },
  experience: { type: String, required: true, validate: wordCountValidator },
});

const courseStudySchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  semester: { type: String, required: true },
  targetGrade: {
    type: String,
    required: true,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: "A+",
  },
  preferredLanguage: { type: String, required: true },
});

const extracurricularSchema = new mongoose.Schema({
  projectInterest: {
    type: String,
    required: true,
    validate: wordCountValidator,
  },
  skillset: { type: [String], required: true },
  experience: { type: String, required: true, validate: wordCountValidator },
  preferredLanguage: { type: String, required: true },
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
    match: [
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
      "Password should contain at least 8 character, one number, one lowercase and one uppercase letter",
    ],
  },
  chatRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      default: [],
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  // for group preference & matching
  groupPreferences: [groupPreferenceSchema],
  // single array for matches - problem with deletion
  courseProjectMatches: [ObjectId],
  courseStudyMatches: [ObjectId],
  extracurricularMatches: [ObjectId],
  // for groups
  groups: [ObjectId],
  groupMatches: [ObjectId],
  // for chat
  socketId: String,
  registrationToken: String,
});

// might need to refactor the methods to helpers
// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

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

const User = mongoose.model("User", UserSchema);

// Export Models
module.exports = {
  User: User,
  groupPreferenceSchema: groupPreferenceSchema,
  GroupPreference: GroupPreference,
  CourseProject: CourseProject,
  CourseStudy: CourseStudy,
  Extracurricular: Extracurricular,
};
