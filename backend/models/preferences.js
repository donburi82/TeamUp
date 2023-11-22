const mongoose = require("mongoose");

const groupPreferenceSchema = new mongoose.Schema({});
const GroupPreference = mongoose.model("GroupPreference", groupPreferenceSchema);

const courseProjectSchema = new mongoose.Schema({
    courseCode: String,
    projectInterest: String,
    skillset: [String],
    targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"], default: "A+" },
    experience: String,
});

const courseStudySchema = new mongoose.Schema({
    courseCode: String,
    targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"], default: "A+" },
    preferredLanguage: String,
});

const extracurricularSchema = new mongoose.Schema({
    projectInterest: String,
    skillset: [String],
    experience: String,
    preferredLanguage: String,
});

const CourseProject = GroupPreference.discriminator("CourseProject", courseProjectSchema);
const CourseStudy = GroupPreference.discriminator("CourseStudy", courseStudySchema);
const Extracurricular = GroupPreference.discriminator("Extracurricular", extracurricularSchema);

module.exports = {
    groupPreferenceSchema: groupPreferenceSchema,
    GroupPreference: GroupPreference,
    CourseProject: CourseProject,
    CourseStudy: CourseStudy,
    Extracurricular: Extracurricular,
};
