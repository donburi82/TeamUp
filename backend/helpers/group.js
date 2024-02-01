const ObjectId = require('mongodb').ObjectId;
const { User } = require("../models/user");
const { Group } = require("../models/group");

async function createGroup(userId, category, project, quota, members) {
    try {
        // leader
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        
        const group = await Group({
            leaderID: userId,
            category: category,
            project: project,
            // projectPeriod
            quota: quota,
            members: members,
        });
        // might have to push groupID's to users' groups individually
        
        return await group.save();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createGroup
};
