const ObjectId = require('mongodb').ObjectId;
const { User, groupPreferenceSchema, GroupPreference, CourseProject, CourseStudy, Extracurricular } = require("../models/user");
const gradeScale = require("../defaults/grades");

function tokenize(text) {
    return text.toLowerCase().split(/\s+/);
}

function jaccardSimilarity(set1, set2) {
    let intersection = new Set([...set1].filter(x => set2.has(x)));
    let union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

function stringSimilarity(str1, str2) {
    let set1 = new Set(tokenize(str1));
    let set2 = new Set(tokenize(str2));
    return jaccardSimilarity(set1, set2);
}

function gradeSimilarity(grade1, grade2) {
    const maxGradeValue = Math.max(...Object.values(gradeScale));
    const difference = Math.abs(gradeScale[grade1] - gradeScale[grade2]);
    return 1 - (difference / maxGradeValue);
}

function skillsetSimilarity(skillset1, skillset2) {
    return 1-jaccardSimilarity(skillset1, skillset2);
}

function computeCourseProjectSimilarity(userPref, matchPref) {
    let score = 0;

    // projectinterest
    score += stringSimilarity(userPref.projectInterest, matchPref.projectInterest);
    console.log(score);

    // targetgrade
    score += gradeSimilarity(userPref.targetGrade, matchPref.targetGrade);
    console.log(score);

    // experience
    score += stringSimilarity(userPref.experience, matchPref.experience);
    console.log(score);

    // skillset
    score += skillsetSimilarity(new Set(userPref.skillset), new Set(matchPref.skillset));
    console.log(score);

    return score;
}

function computeCourseStudySimilarity(userPref, matchPref) {
    let score = 0;

    // targetgrade
    score += gradeSimilarity(userPref.targetGrade, matchPref.targetGrade);
    console.log(score);

    // preferredLanguage
    score += (userPref.preferredLanguage.toString()===matchPref.preferredLanguage.toString());
    console.log(score);

    return score;
}

function computeExtracurricularSimilarity(userPref, matchPref) {
    let score = 0;

    // projectinterest
    score += stringSimilarity(userPref.projectInterest, matchPref.projectInterest);
    console.log(score);

    // experience
    score += stringSimilarity(userPref.experience, matchPref.experience);
    console.log(score);

    // skillset
    score += skillsetSimilarity(new Set(userPref.skillset), new Set(matchPref.skillset));
    console.log(score);

    // preferredLanguage
    score += (userPref.preferredLanguage.toString()===matchPref.preferredLanguage.toString());
    console.log(score);

    return score;
}

async function getCourseProjectProfiles(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        const preferences = user.groupPreferences.toObject().filter(preference => preference.__t.toString()==="CourseProject");
        let recommendations = [];

        // cache recommendations locally for faster retrieval unless user refreshes
        for (var pref of preferences) {
            const poolProfiles = await User.find({
                _id: { $ne: userId },
                "groupPreferences.__t": "CourseProject",
                "groupPreferences.courseCode": pref.courseCode,
                "groupPreferences.semester": pref.semester,
            }).lean();

            if (poolProfiles) {
                for (var profile of poolProfiles) {
                    profile.groupPreferences.forEach(profilePref => {
                        if (profilePref.__t.toString()==="CourseProject" && pref.courseCode.toString()===profilePref.courseCode.toString() && pref.semester.toString()===profilePref.semester.toString()) {
                            let score = computeCourseProjectSimilarity(pref, profilePref);
                            recommendations.push({ userId: profile._id, score: score });
                        }
                    });
                }
            }
        }
        console.log("Recommendations:", recommendations);

        // sort recommendations based on the score and remove duplicate userID's if any
        const sortedRecommendations = recommendations
            .sort((a, b) => b.score - a.score)
            .map(rec => rec.userId.toString());
        const finalRecommendations = Array.from(new Set(sortedRecommendations));

        // update DB
        user.courseProjectMatches = finalRecommendations;
        await user.save();

        return finalRecommendations;
    } catch (error) {
        throw error;
    }
}

async function getCourseStudyProfiles(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        const preferences = user.groupPreferences.toObject().filter(preference => preference.__t.toString()==="CourseStudy");
        let recommendations = [];

        // cache recommendations locally for faster retrieval unless user refreshes
        for (var pref of preferences) {
            const poolProfiles = await User.find({
                _id: { $ne: userId },
                "groupPreferences.__t": "CourseStudy",
                "groupPreferences.courseCode": pref.courseCode,
                "groupPreferences.semester": pref.semester,
            }).lean();

            if (poolProfiles) {
                for (var profile of poolProfiles) {
                    profile.groupPreferences.forEach(profilePref => {
                        if (profilePref.__t.toString()==="CourseStudy" && pref.courseCode.toString()===profilePref.courseCode.toString() && pref.semester.toString()===profilePref.semester.toString()) {
                            let score = computeCourseStudySimilarity(pref, profilePref);
                            recommendations.push({ userId: profile._id, score: score });
                        }
                    });
                }
            }
        }
        console.log("Recommendations:", recommendations);

        // sort recommendations based on the score and remove duplicate userID's if any
        const sortedRecommendations = recommendations
            .sort((a, b) => b.score - a.score)
            .map(rec => rec.userId.toString());
        const finalRecommendations = Array.from(new Set(sortedRecommendations));

        // update DB
        user.courseStudyMatches = finalRecommendations;
        await user.save();

        return finalRecommendations;
    } catch (error) {
        throw error;
    }
}

async function getExtracurricularProfiles(userId) {
    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        const preferences = user.groupPreferences.toObject().filter(preference => preference.__t.toString()==="Extracurricular");
        let recommendations = [];

        // cache recommendations locally for faster retrieval unless user refreshes
        for (var pref of preferences) {
            const poolProfiles = await User.find({
                _id: { $ne: userId },
                "groupPreferences.__t": "Extracurricular",
            }).lean();

            if (poolProfiles) {
                for (var profile of poolProfiles) {
                    profile.groupPreferences.forEach(profilePref => {
                        if (profilePref.__t.toString()==="Extracurricular" && stringSimilarity(pref.projectInterest, profilePref.projectInterest)>0.5) {
                            let score = computeExtracurricularSimilarity(pref, profilePref);
                            recommendations.push({ userId: profile._id, score: score });
                        }
                    });
                }
            }
        }
        console.log("Recommendations:", recommendations);

        // sort recommendations based on the score and remove duplicate userID's if any
        const sortedRecommendations = recommendations
            .sort((a, b) => b.score - a.score)
            .map(rec => rec.userId.toString());
        const finalRecommendations = Array.from(new Set(sortedRecommendations));

        // update DB
        user.extracurricularMatches = finalRecommendations;
        await user.save();

        return finalRecommendations;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCourseProjectProfiles, getCourseStudyProfiles, getExtracurricularProfiles
};
