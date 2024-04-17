const ObjectId = require('mongodb').ObjectId;
const { User } = require("../models/user");
const { Group } = require("../models/group");
const {
    createChatRoom,
    updateChatRoom,
    deleteChatRoom,
    sendMessage,
    markMessagesAsRead,
    getMessagesFromChatRoom,
    getChatRoomsForUser,
    getMessageStatus,
} = require("./chat");

async function getGroupInfo(groupId) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) }).populate('members');
        if (!group) {
            throw new Error("Group not found");
        }
        return group;
    } catch (error) {
        throw error;
    }
}

async function getAvailableGroups(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        // get all groups that user does not belong to
        const groups = await Group.find({
            _id: { $nin: user.groups }
        });
        // similarity scores if have time
        const groupIds = groups.map(group => group._id.toString());

        user.groupMatches = groupIds;
        await user.save();
        
        return groups;
    } catch (error) {
        throw error;
    }
}

async function getMyGroups(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) }).populate('groups');
        if (!user) {
            throw new Error("User not found");
        }

        return user.groups;
    } catch (error) {
        throw error;
    }
}

async function createGroup(leaderId, name, category, project, quota, members) {
    try {
        const user = await User.findOne({ _id: new ObjectId(leaderId) });
        if (!user) {
            throw new Error("User not found");
        }
        
        const membersToAdd = Array.from(new Set([leaderId, ...members]));

        const group = await Group({
            leaderID: leaderId,
            name: name,
            category: category,
            project: project,
            // projectPeriod
            quota: quota,
            members: membersToAdd,
        });
        const savedGroup = await group.save();

        // Update groups list for every member
        await User.updateMany(
            { _id: { $in: membersToAdd } },
            { $addToSet: { groups: savedGroup._id } }
        );

        // Create a chatroom (updates members chatRoomIds and group chatRoomId)
        const room = await createChatRoom(membersToAdd, savedGroup._id);

        return room;
    } catch (error) {
        throw error;
    }
}

async function updateGroup(userId, groupId, name, category, project, quota) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()!==userId.toString()) {
            throw new Error("Only the leader can update the group");
        }

        // check whether it has already been finalized or not
        if (group.finalized===true) {
            throw new Error("Group already finalized");
        }

        group.name = name;
        group.category = category;
        group.project = project;
        group.quota = quota;

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
            throw new Error("Only the leader can finalize the group");
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

async function leaveGroup(userId, groupId) {
    try {
        const group = await Group.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            throw new Error("Group not found");
        }

        // check whether it's the leader calling the endpoint
        if (group.leaderID.toString()===userId.toString()) {
            throw new Error("Leaders are not allowed to leave the group");
        }

        // check whether it has already been finalized or not
        if (group.finalized===true) {
            throw new Error("Group already finalized");
        }

        // update
        group.members = group.members.filter(member => member.toString()!==userId.toString());
        await group.save();

        const user = await User.findOne({ _id: new ObjectId(userId) });
        user.groups = user.groups.filter(group => group.toString()!==groupId.toString());

        return await user.save();
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
        if (group.members.length+members.length > group.quota) {
            throw new Error("Exceeds quota");
        }

        // add members to the group and the chatroom
        await Promise.all(members.map(async (member) => {
            if (!group.members.includes(member)) {
                group.members.push(member);
                await updateChatRoom(member, group.chatRoomID, true);
            }
        }));
        // members.forEach(member => {
        //     if (!group.members.includes(member)) {
        //         group.members.push(member);
        //     }
        // });
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
        if (group.members.length-members.length < 1) {
            throw new Error("Exceeds quota");
        }

        // remove members from the group and the chatroom
        await Promise.all(members.map(async (member) => {
            await updateChatRoom(member, group.chatRoomID, false);
        }));
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
    getGroupInfo,
    getMyGroups, getAvailableGroups, createGroup, updateGroup, deleteGroup,
    finalizeGroup, leaveGroup,
    addMembers, removeMembers,
};
