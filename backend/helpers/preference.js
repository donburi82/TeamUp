const ObjectId = require('mongodb').ObjectId;
const { groupPreferenceSchema, GroupPreference, CourseProject, CourseStudy, Extracurricular } = require("../models/preferences");

async function getCourseProjectPreference() {
    try {
        const preferences = await CourseProject.find().exec();
        console.log(preferences);
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createCourseProjectPreference(courseCode, projectInterest, skillset, targetGrade, experience) {
    try {
        // need param checking
        const courseProjectPreference = await CourseProject({
            courseCode: courseCode,
            projectInterest: projectInterest,
            skillset: skillset,
            targetGrade: targetGrade,
            experience: experience,
        });
        return await courseProjectPreference.save();
    } catch (error) {
        throw error;
    }
}

async function deleteCourseProjectPreference(id) {
    try {
        return await CourseProject.deleteOne({ _id: new ObjectId(id) }).exec();
    } catch (error) {
        throw error;
    }
}

async function getCourseStudyPreference() {
    try {
        const preferences = await CourseStudy.find().exec();
        console.log(preferences);
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createCourseStudyPreference(courseCode, targetGrade, preferredLanguage) {
    try {
        // need param checking
        const courseStudyPreference = await CourseStudy({
            courseCode: courseCode,
            targetGrade: targetGrade,
            preferredLanguage: preferredLanguage,
        });
        return await courseStudyPreference.save();
    } catch (error) {
        throw error;
    }
}

async function deleteCourseStudyPreference(id) {
    try {
        return await CourseStudy.deleteOne({ _id: new ObjectId(id) }).exec();
    } catch (error) {
        throw error;
    }
}

async function getExtracurricularPreference() {
    try {
        const preferences = await Extracurricular.find().exec();
        console.log(preferences);
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createExtracurricularPreference(projectInterest, skillset, experience, preferredLanguage) {
    try {
        // need param checking
        const extracurricularPreference = await Extracurricular({
            projectInterest: projectInterest,
            skillset: skillset,
            experience: experience,
            preferredLanguage: preferredLanguage,
        });
        return await extracurricularPreference.save();
    } catch (error) {
        throw error;
    }
}

async function deleteExtracurricularPreference(id) {
    try {
        return await Extracurricular.deleteOne({ _id: new ObjectId(id) }).exec();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCourseProjectPreference, createCourseProjectPreference, deleteCourseProjectPreference,
    getCourseStudyPreference, createCourseStudyPreference, deleteCourseStudyPreference,
    getExtracurricularPreference, createExtracurricularPreference, deleteExtracurricularPreference 
};
