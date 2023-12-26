const express = require("express");
const router = express.Router();
const AdminInfo = require("../../models/adminInfo");

router
  .route("/domains")
  // req.body {domain:string}
  .post(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      if (!adminInfo.WhiteListEmailDomain.includes(req.body.domain)) {
        adminInfo.WhiteListEmailDomain.push(req.body.domain);
        await adminInfo.save();
        return res.status(200).send({
          status: "success",
          data: adminInfo.WhiteListEmailDomain,
        });
      } else {
        return res.status(400).send({
          status: "fail",
          msg: "domain already exist",
        });
      }
    } catch (error) {
      return res.status(400).send({ status: "fail", msg: error.message });
    }
  })
  // {oldEmailDomain: string, newEmailDomain: string}
  .patch(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Check if the old email domain exists in the array
      const index = adminInfo.WhiteListEmailDomain.indexOf(
        req.body.oldEmailDomain
      );
      if (index === -1) {
        return res
          .status(400)
          .send({ status: "fail", msg: "Old Domain not found" });
      }
      if (adminInfo.WhiteListEmailDomain.includes(req.body.oldEmailDomain)) {
        return res
          .status(400)
          .send({ status: "fail", msg: "Old Domain already exist" });
      }
      // Replace the old email domain with the new email domain
      adminInfo.WhiteListEmailDomain[index] = req.body.newEmailDomain;
      // Save the updated document
      await adminInfo.save();
      return res.status(200).send({
        status: "success",
        data: adminInfo.WhiteListEmailDomain,
      });
    } catch (error) {
      return res.status(400).send({ status: "fail", msg: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Return the WhiteListEmailDomain array
      return res.status(200).send({
        status: "success",
        data: adminInfo.WhiteListEmailDomain,
      });
    } catch (error) {
      return res.status(400).send({
        status: "fail",
        msg: error.message,
      });
    }
  })
  // {domain: string}
  .delete(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Check if the course exists in the array
      const index = adminInfo.WhiteListEmailDomain.indexOf(req.body.domain);
      if (index === -1) {
        return res
          .status(400)
          .send({ status: "fail", msg: "Course not found" });
      }
      // Remove the course from the array
      adminInfo.WhiteListEmailDomain.splice(index, 1);
      // Save the updated document
      await adminInfo.save();
      return res.status(200).send({
        status: "success",
        data: adminInfo.WhiteListEmailDomain,
      });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  });

router
  .route("/courses")
  // req.body {course: string}
  .post(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      if (!adminInfo) {
        const newAdminInfo = new AdminInfo({
          WhiteListEmailDomain: [],
          courseList: [req.body.course],
        });
        await newAdminInfo.save();
        return res.status(200).send({
          status: "success",
          data: adminInfo.courseList,
        });
      } else {
        adminInfo.courseList.push(req.body.course);
        await adminInfo.save();
        return res.status(200).send({
          status: "success",
          data: adminInfo.courseList,
        });
      }
    } catch (error) {
      return res.status(400).send({ status: "fail", msg: error.message });
    }
  })
  // {oldCourse: string, newCourse: string}
  .patch(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Check if the old course exists in the array
      const index = adminInfo.courseList.indexOf(req.body.oldCourse);
      if (index === -1) {
        return res
          .status(400)
          .send({ status: "fail", msg: "Old Course not found" });
      }
      // Replace the old course with the new course
      adminInfo.courseList[index] = req.body.newCourse;
      // Save the updated document
      await adminInfo.save();
      return res.status(200).send({
        status: "success",
        data: adminInfo.courseList,
      });
    } catch (error) {
      return res.status(400).send({ status: "fail", msg: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Return the courseList array
      return res.status(200).send({
        status: "success",
        data: adminInfo.courseList,
      });
    } catch (error) {
      return res.status(400).send({
        status: "fail",
        msg: error.message,
      });
    }
  })
  // {course: string}
  .delete(async (req, res) => {
    try {
      const adminInfo = await AdminInfo.findOne();

      // Check if the course exists in the array
      const index = adminInfo.courseList.indexOf(req.body.course);
      if (index === -1) {
        return res
          .status(400)
          .send({ status: "fail", msg: "Course not found" });
      }
      // Remove the course from the array
      adminInfo.courseList.splice(index, 1);
      // Save the updated document
      await adminInfo.save();
      return res.status(200).send({
        status: "success",
        data: adminInfo.courseList,
      });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  });

module.exports = router;
