const ObjectId = require('mongodb').ObjectId;
const { User } = require("../models/user");
const { Group } = require("../models/group");
const user = require('../models/user');

async function getGroups(userId, mode) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        let groups;

        if (mode=="my") {
            groups = user.groups;
        } else if (mode=="available") {
            console.log("Matching Engine");
        }
        
        return groups;
    } catch (error) {
        throw error;
    }
}

async function createGroup(userId, category, project, quota) {
    try {
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
            members: [userId],
        });

        user.groups.push(group._id);
        await user.save();
        
        return await group.save();
    } catch (error) {
        throw error;
    }
}

async function deleteGroup(userId, groupId) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()!==userId.toString()) {
            throw new Error("Only the leader can delete the group");
        }

        // update members' group lists
        await User.updateMany(
            { _id: { $in: group.members }},
            { $pull: { groups: groupId }},
        );

        return await group.deleteOne({ _id: new ObjectId(groupId) });
    } catch (error) {
        throw error;
    }
}

async function finalizeGroup(userId, groupId) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()!==userId.toString()) {
            throw new Error("Only the leader can delete the group");
        }

        // check whether it has already been finalized or not
        if (group.finalized===true) {
            throw new Error("Group already finalized");
        }

        group.finalized = true;
        return await group.save();
    } catch (error) {
        throw error;
    }
}

async function addMembers(userId, groupId, members) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()!==userId.toString()) {
            throw new Error("Only the leader can add members");
        }

        // check whether it has already been finalized or not
        if (group.finalized===true) {
            throw new Error("Group already finalized");
        }

        // need to check it doesn't exceed quota after add

        // add members to the group
        members.forEach(member => {
            if (!group.members.includes(member)) {
                group.members.push(member);
            }
        });
        await group.save();

        // update membership information for every member
        await User.updateMany(
            { _id: { $in: members} },
            { $addToSet: { groups: groupId } }
        );

        return;
    } catch (error) {
        throw error;
    }
}

async function removeMembers(userId, groupId, members) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()!==userId.toString()) {
            throw new Error("Only the leader can remove members");
        }

        // check whether it has already been finalized or not
        if (group.finalized===true) {
            throw new Error("Group already finalized");
        }

        // need to check len>0 after removal

        // remove members from the group
        group.members = group.members.filter(member => !members.includes(member.toString()));
        await group.save();

        // update membership information for every member
        await User.updateMany(
            { _id: { $in: members} },
            { $pull: { groups: groupId } }
        );

        return;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getGroups, createGroup, deleteGroup, finalizeGroup,
    addMembers, removeMembers,
};
