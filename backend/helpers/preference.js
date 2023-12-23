const ObjectId = require('mongodb').ObjectId;
const { User, groupPreferenceSchema, GroupPreference, CourseProject, CourseStudy, Extracurricular } = require("../models/user");

async function getCourseProjectPreference(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const preferences = user.groupPreferences.filter(preference => preference.__t.toString()==="CourseProject");
        console.log(preferences);
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createCourseProjectPreference(userId, courseCode, projectInterest, skillset, targetGrade, experience) {
    try {
        // need param checking
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const courseProjectPreference = await CourseProject({
            courseCode: courseCode,
            projectInterest: projectInterest,
            skillset: skillset,
            targetGrade: targetGrade,
            experience: experience,
        });

        user.groupPreferences.push(courseProjectPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function deleteCourseProjectPreference(userId, preferenceId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        user.groupPreferences = user.groupPreferences.filter(preference => preference._id.toString()!==preferenceId);
        
        return await user.save();
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
