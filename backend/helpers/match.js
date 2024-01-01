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

function computeSimilarityScore(userPref, matchPref) {
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
    score += jaccardSimilarity(new Set(userPref.skillset), new Set(matchPref.skillset));
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

        if (user.courseProjectRematch===true) {
            // find matches again
            // single array: need to remove existing matches (just for this category)
            // multiple arrays: simply overwrite
            console.log("Rematch");

            for (var pref of preferences) {
                const poolProfiles = await User.find({
                    _id: { $ne: userId },
                    "groupPreferences.__t": "CourseProject",
                    "groupPreferences.courseCode": pref.courseCode,
                }).lean();

                if (poolProfiles) {
                    for (var profile of poolProfiles) {
                        console.log(profile._id);
                        profile.groupPreferences.forEach(profilePref => {
                            if (profilePref.__t.toString()==="CourseProject" && pref.courseCode.toString()===profilePref.courseCode.toString()) {
                                let score = computeSimilarityScore(pref, profilePref);
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
            user.courseProjectRematch = false;
            await user.save();

            return finalRecommendations; // Remove duplicate userIds if any
        } else {
            // otherwise, return stored matches
            console.log("Existing");
            return user.courseProjectMatches;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCourseProjectProfiles,
};
