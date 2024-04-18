const express = require("express");
const router = express.Router();

const {
  getGroupInfo,
  getMyGroups,
  getAvailableGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  finalizeGroup,
  leaveGroup,
  addMembers,
  removeMembers,
} = require("../../helpers/group");

router.get("/info", async (req, res) => {
  try {
    const { groupId } = req.query;
    console.log(groupId);
    const group = await getGroupInfo(groupId);
    return res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mode } = req.query;
    let groups;
    if (mode == "my") {
      groups = await getMyGroups(userId);
    } else if (mode == "available") {
      groups = await getAvailableGroups(userId);
    }
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const leaderId = req.user.userId;
    const { name, category, project, quota, members } = req.body;
    console.log(name, category, project, quota, members);
    const chatRoom = await createGroup(
      leaderId,
      name,
      category,
      project,
      quota,
      members
    );
    return res.status(200).json({ success: true, room: chatRoom._id });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.patch("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, name, category, project, quota } = req.query;
    await updateGroup(userId, groupId, name, category, project, quota);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId } = req.query;
    console.log("delete group", groupId);
    await deleteGroup(userId, groupId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/finalize", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId } = req.query;
    await finalizeGroup(userId, groupId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/leave", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId } = req.query;
    await leaveGroup(userId, groupId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/members", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, members } = req.body;
    ConfigurationServicePlaceholders.log(
      "addMembers",
      userId,
      groupId,
      members
    );
    await addMembers(userId, groupId, members);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error });
  }
});

router.delete("/members", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, members } = req.body;
    await removeMembers(userId, groupId, members);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

module.exports = router;
