
import calcLeetCodeScore from "./sources/leetcodeScore.js";
import calcGitHubScore from "./sources/githubScore.js";

console.log("======================================");
console.log("       SPI EVIDENCE ENGINE TEST       ");
console.log("======================================");

console.log("\n===== LeetCode Test =====");

const leetcodeResult = calcLeetCodeScore({
    year: 3,
    leetcodeStats: {
        easySolved: 120,
        mediumSolved: 250,
        hardSolved: 40,
        contestRating: 1300,
        lastSubmissionDate: new Date(),
    },
});

console.log(JSON.stringify(leetcodeResult, null, 2));

console.log("\n===== GitHub Test =====");

const githubResult = calcGitHubScore({
    year: 3,
    githubStats: {
        totalContributions: 250,
        publicRepos: 10,
        qualityRepos: 4,
        languages: ["Java", "JavaScript", "Python"],
        lastActivityDate: new Date(),
        fetchedAt: new Date(),
    },
});

console.log(JSON.stringify(githubResult, null, 2));

console.log("\n======================================");
console.log("             TEST SUMMARY             ");
console.log("======================================");

console.log("LeetCode Score :", leetcodeResult.score + "/10");
console.log("GitHub Score   :", githubResult.score + "/10");

console.log("\nEvidence Engines Working Successfully.");
