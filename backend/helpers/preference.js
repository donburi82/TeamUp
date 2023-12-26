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

async function getCourseStudyPreference(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId)});
        if (!user) {
            throw new Error("User not found");
        }

        const preferences = user.groupPreferences.filter(preference => preference.__t.toString()==="CourseStudy");
        console.log(preferences);
        return preferences;
    } catch (error) {
        throw error;
    }
}

async function createCourseStudyPreference(userId, courseCode, targetGrade, preferredLanguage) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }

        const courseStudyPreference = await CourseStudy({
            courseCode: courseCode,
            targetGrade: targetGrade,
            preferredLanguage: preferredLanguage,
        });

        user.groupPreferences.push(courseStudyPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function deleteCourseStudyPreference(userId, preferenceId) {
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

async function getExtracurricularPreference(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId)});
        if (!user) {
            throw new Error("User not found");
        }

        const preferences = user.groupPreferences.filter(preference => preference.__t.toString()==="Extracurricular");
        console.log(preferences);
        return preferences;
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

        const extracurricularPreference = await Extracurricular({
            projectInterest: projectInterest,
            skillset: skillset,
            experience: experience,
            preferredLanguage: preferredLanguage,
        });

        user.groupPreferences.push(extracurricularPreference);

        return await user.save();
    } catch (error) {
        throw error;
    }
}

async function deleteExtracurricularPreference(userId, preferenceId) {
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
    getCourseProjectPreference, createCourseProjectPreference, deleteCourseProjectPreference,
    getCourseStudyPreference, createCourseStudyPreference, deleteCourseStudyPreference,
    getExtracurricularPreference, createExtracurricularPreference, deleteExtracurricularPreference 
};
