const ObjectId = require('mongodb').ObjectId;
const { groupPreferenceSchema, GroupPreference, CourseProject, CourseStudy, Extracurricular } = require("../models/preferences");

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

module.exports = { getExtracurricularPreference, createExtracurricularPreference, deleteExtracurricularPreference };
