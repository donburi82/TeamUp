const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

const GroupSchema = new mongoose.Schema({
    leaderID: { type: ObjectId, required: true },
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["CourseProject", "CourseStudy", "Extracurricular"],
        default: "CourseProject",
    },
    project: { type: String, required: true },
    // projectPeriod
    quota: { type: Number, required: true },
    members: [ObjectId],
    finalized: { type: Boolean, default: false },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = {
    Group: Group,
};
