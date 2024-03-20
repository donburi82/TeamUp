const express = require("express");
const router = express.Router();

const {
    getMyGroups, getAvailableGroups, createGroup, deleteGroup,
    finalizeGroup, leaveGroup,
    addMembers, removeMembers,
} = require("../../helpers/group");

router.get("/", async (req, res) => {
    try {
        const { userId, mode } = req.query;
        let groups;
        if (mode=="my") {
            groups = getMyGroups(userId);
        } else if (mode=="available") {
            groups = getAvailableGroups(userId);
        }
        console.log(groups);
        return res.status(200).json({ success: true, data: groups });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        await createGroup(
            req.body.userId,
            req.body.category,
            req.body.project,
            req.body.quota,
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.delete("/", async (req, res) => {
    try {
        const { userId, groupId } = req.query;
        await deleteGroup(userId, groupId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/finalize", async (req, res) => {
    try {
        const { userId, groupId } = req.query;
        await finalizeGroup(userId, groupId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/leave", async (req, res) => {
    try {
        const { userId, groupId } = req.query;
        await leaveGroup(userId, groupId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/members", async (req, res) => {
    try {
        console.log(req.body);
        await addMembers(
            req.body.userId,
            req.body.groupId,
            req.body.members,
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.delete("/members", async (req, res) => {
    try {
        console.log(req.body);
        await removeMembers(
            req.body.userId,
            req.body.groupId,
            req.body.members,
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

module.exports = router;
