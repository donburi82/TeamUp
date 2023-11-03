const mongoose = require("mongoose");
// const util = require('util');

// function AbstractSchema() {
//     mongoose.Schema.apply(this, arguments);
// }
// util.inherits(AbstractSchema, mongoose.Schema);
// const GroupPreferenceSchema = AbstractSchema();

// const CourseProjectSchema = new AbstractSchema({
//     courseCode: String,
//     projectInterest: String,
//     skillset: [String],
//     targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]},
//     experience: String,
// });

// const CourseStudySchema = new AbstractSchema({
//     courseCode: String,
//     targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]},
//     preferredLanguage: String,
// });

// const ExtracurricularSchema = new AbstractSchema({
//     projectInterest: String,
//     skillset: [String],
//     experience: String,
//     preferredLanguage: String,
// });

// const GroupPreference = mongoose.model("GroupPreference", GroupPreferenceSchema);
// const CourseProject = GroupPreference.discriminator("CourseProject", CourseProjectSchema);
// const CourseStudy = GroupPreference.discriminator("CourseStudy", CourseStudySchema);
// const Extracurricular = GroupPreference.discriminator("Extracurricular", ExtracurricularSchema);

const groupPreferenceSchema = new mongoose.Schema({});
const GroupPreference = mongoose.model("GroupPreference", groupPreferenceSchema);

const courseProjectSchema = new mongoose.Schema({
    courseCode: String,
    projectInterest: String,
    skillset: [String],
    targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]},
    experience: String,
});

const courseStudySchema = new mongoose.Schema({
    courseCode: String,
    targetGrade: { type: String, enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]},
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
    courseProjectSchema: courseProjectSchema,
    CourseProject: CourseProject,
    courseStudySchema: courseStudySchema,
    CourseStudy: CourseStudy,
    extracurricularSchema: extracurricularSchema,
    Extracurricular: Extracurricular,
};
