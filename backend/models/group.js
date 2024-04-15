const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    leaderID: { type: mongoose.Schema.Types.ObjectId, required: true },
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
    members: [mongoose.Schema.Types.ObjectId],
    finalized: { type: Boolean, default: false },
    chatRoomID: { type: mongoose.Schema.Types.ObjectId },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = {
    Group: Group,
};
