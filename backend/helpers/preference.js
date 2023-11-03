const mongoose = require("mongoose");
const { groupPreferenceSchema, GroupPreference, courseProjectSchema, CourseProject, courseStudySchema, CourseStudy, extracurricularSchema, Extracurricular } = require("../models/preferences");

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

module.exports = { createExtracurricularPreference };
