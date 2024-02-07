const ObjectId = require('mongodb').ObjectId;
const { User, groupPreferenceSchema, GroupPreference, CourseProject, CourseStudy, Extracurricular } = require("../models/user");

async function getGroupPreferences(userId, groupType) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        
        let preferences;
        if (groupType) {
            preferences = user.groupPreferences.filter(preference => preference.__t.toString()===groupType);
        } else {
            preferences = user.groupPreferences;
        }
        
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createCourseProjectPreference(userId, courseCode, semester, projectInterest, skillset, targetGrade, experience) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const courseProjectPreference = await CourseProject({
            courseCode: courseCode,
            semester: semester,
            projectInterest: projectInterest,
            skillset: skillset,
            targetGrade: targetGrade,
            experience: experience,
        });

        const validationError = courseProjectPreference.validateSync();
        if (validationError) {
            throw validationError;
        }

        user.groupPreferences.push(courseProjectPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function createCourseStudyPreference(userId, courseCode, semester, targetGrade, preferredLanguage) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const courseStudyPreference = await CourseStudy({
            courseCode: courseCode,
            semester: semester,
            targetGrade: targetGrade,
            preferredLanguage: preferredLanguage,
        });

        const validationError = courseStudyPreference.validateSync();
        if (validationError) {
            throw validationError;
        }

        user.groupPreferences.push(courseStudyPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function createExtracurricularPreference(userId, projectInterest, skillset, experience, preferredLanguage) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const extracurricularPreference = new Extracurricular({
            projectInterest: projectInterest,
            skillset: skillset,
            experience: experience,
            preferredLanguage: preferredLanguage,
        });

        const validationError = extracurricularPreference.validateSync();
        if (validationError) {
            throw validationError;
        }

        user.groupPreferences.push(extracurricularPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function deleteGroupPreference(userId, preferenceId) {
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

module.exports = {
    getGroupPreferences,
    createCourseProjectPreference, createCourseStudyPreference, createExtracurricularPreference,
    deleteGroupPreference
};
