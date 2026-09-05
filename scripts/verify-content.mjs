import { scienceQuestions } from "../data/class-8-science.ts";
import { class8ScienceMore } from "../data/class-8-science-expansion.ts";
import { sscBangla, sscBgs, sscEnglish, sscMath, sscScience } from "../data/class-9-10-core.ts";
import { sscBanglaDepth, sscBgsDepth, sscEnglishDepth, sscMathDepth, sscScienceDepth } from "../data/class-9-10-core-depth.ts";
import { sscBiology, sscChemistry, sscHigherMath, sscIct, sscPhysics } from "../data/class-9-10-science-group.ts";
import { sscBanglaFinal, sscBgsFinal, sscBiologyFinal, sscChemistryFinal, sscEnglishFinal, sscHigherMathFinal, sscIctFinal, sscMathFinal, sscPhysicsFinal, sscScienceFinal } from "../data/class-9-10-final-depth.ts";
import { sscStandardBangla, sscStandardBgs, sscStandardBiology, sscStandardChemistry, sscStandardEnglish, sscStandardHigherMath, sscStandardIct, sscStandardMath, sscStandardPhysics, sscStandardScience } from "../data/class-9-10-standard-upgrade.ts";
import { class9BoardUpgrade, class10BoardUpgrade } from "../data/class-9-10-progression.ts";
import { sscChallengeSet } from "../data/class-9-10-challenge-set.ts";
import { sscBoardAnalysisSet } from "../data/class-9-10-board-analysis.ts";
import { sscAuthoredDepth } from "../data/class-9-10-authored-depth.ts";
import { sscAuthoredFinal } from "../data/class-9-10-authored-final.ts";
import { banglaQuestions, bgsQuestions, englishQuestions, mathQuestions } from "../data/class-8-main-subjects.ts";
import { class8BanglaDepth, class8BgsDepth, class8EnglishDepth, class8MathDepth } from "../data/class-8-main-depth.ts";
import { class7BanglaQuestions, class7BgsQuestions, class7EnglishQuestions, class7MathQuestions, class7ScienceQuestions } from "../data/class-7-main-subjects.ts";
import { class7BanglaDepth, class7BgsDepth, class7EnglishDepth } from "../data/class-7-language-social-depth.ts";
import { class6BanglaQuestions, class6BgsQuestions, class6EnglishQuestions, class6MathQuestions, class6ScienceQuestions } from "../data/class-6-main-subjects.ts";
import { class6BanglaDepth, class6BgsDepth, class6EnglishDepth } from "../data/class-6-language-social-depth.ts";
import { class5BanglaQuestions, class5BgsQuestions, class5EnglishQuestions, class5MathQuestions, class5ScienceQuestions } from "../data/class-5-main-subjects.ts";
import { class5BanglaDepth, class5BgsDepth, class5EnglishDepth } from "../data/class-5-language-social-depth.ts";
import { class5MathDepth, class5MathMore, class5ScienceDepth, class5ScienceMore, class6MathDepth, class6MathMore, class6ScienceDepth, class6ScienceMore, class7MathDepth, class7MathMore, class7ScienceDepth, class7ScienceMore } from "../data/expansion-questions.ts";
import { buildPracticeQuestions, getDifficulty } from "../lib/quiz-engine.ts";
import { ensureMinimumQuestions } from "../lib/question-expander.ts";

const baseTracks = {
  "Class 8 Science": [...scienceQuestions, ...class8ScienceMore], "Class 8 Mathematics": [...mathQuestions,...class8MathDepth], "Class 8 English": [...englishQuestions,...class8EnglishDepth], "Class 8 Bangla": [...banglaQuestions,...class8BanglaDepth], "Class 8 BGS": [...bgsQuestions,...class8BgsDepth],
  "Class 7 Science": [...class7ScienceQuestions, ...class7ScienceMore, ...class7ScienceDepth], "Class 7 Mathematics": [...class7MathQuestions, ...class7MathMore, ...class7MathDepth], "Class 7 English": [...class7EnglishQuestions,...class7EnglishDepth], "Class 7 Bangla": [...class7BanglaQuestions,...class7BanglaDepth], "Class 7 BGS": [...class7BgsQuestions,...class7BgsDepth],
  "Class 6 Science": [...class6ScienceQuestions, ...class6ScienceMore, ...class6ScienceDepth], "Class 6 Mathematics": [...class6MathQuestions, ...class6MathMore, ...class6MathDepth], "Class 6 English": [...class6EnglishQuestions,...class6EnglishDepth], "Class 6 Bangla": [...class6BanglaQuestions,...class6BanglaDepth], "Class 6 BGS": [...class6BgsQuestions,...class6BgsDepth],
  "Class 5 Science": [...class5ScienceQuestions, ...class5ScienceMore, ...class5ScienceDepth], "Class 5 Mathematics": [...class5MathQuestions, ...class5MathMore, ...class5MathDepth], "Class 5 English": [...class5EnglishQuestions,...class5EnglishDepth], "Class 5 Bangla": [...class5BanglaQuestions,...class5BanglaDepth], "Class 5 BGS": [...class5BgsQuestions,...class5BgsDepth],
  "Class 9 Science": [...sscScience,...sscScienceDepth,...sscScienceFinal], "Class 9 Mathematics": [...sscMath,...sscMathDepth,...sscMathFinal], "Class 9 English": [...sscEnglish,...sscEnglishDepth,...sscEnglishFinal], "Class 9 Bangla": [...sscBangla,...sscBanglaDepth,...sscBanglaFinal], "Class 9 BGS": [...sscBgs,...sscBgsDepth,...sscBgsFinal],
  "Class 9 Physics": [...sscPhysics,...sscPhysicsFinal], "Class 9 Chemistry": [...sscChemistry,...sscChemistryFinal], "Class 9 Biology": [...sscBiology,...sscBiologyFinal], "Class 9 Higher Mathematics": [...sscHigherMath,...sscHigherMathFinal], "Class 9 ICT": [...sscIct,...sscIctFinal],
  "Class 10 Science": [...sscScience,...sscScienceDepth,...sscScienceFinal], "Class 10 Mathematics": [...sscMath,...sscMathDepth,...sscMathFinal], "Class 10 English": [...sscEnglish,...sscEnglishDepth,...sscEnglishFinal], "Class 10 Bangla": [...sscBangla,...sscBanglaDepth,...sscBanglaFinal], "Class 10 BGS": [...sscBgs,...sscBgsDepth,...sscBgsFinal],
  "Class 10 Physics": [...sscPhysics,...sscPhysicsFinal], "Class 10 Chemistry": [...sscChemistry,...sscChemistryFinal], "Class 10 Biology": [...sscBiology,...sscBiologyFinal], "Class 10 Higher Mathematics": [...sscHigherMath,...sscHigherMathFinal], "Class 10 ICT": [...sscIct,...sscIctFinal],
};
const standardBySubject = { Science: sscStandardScience, Mathematics: sscStandardMath, English: sscStandardEnglish, Bangla: sscStandardBangla, BGS: sscStandardBgs, Physics: sscStandardPhysics, Chemistry: sscStandardChemistry, Biology: sscStandardBiology, "Higher Mathematics": sscStandardHigherMath, ICT: sscStandardIct };
const tracks = Object.fromEntries(Object.entries(baseTracks).map(([track, questions]) => {
  const seniorMatch = track.match(/^Class (9|10) (.+)$/);
  const progression = seniorMatch?.[1] === "9" ? class9BoardUpgrade : seniorMatch?.[1] === "10" ? class10BoardUpgrade : [];
  const enriched = seniorMatch ? [...questions, ...(standardBySubject[seniorMatch[2]] ?? []), ...progression.filter((question) => question.origin.includes(`Class ${seniorMatch[1]} ${seniorMatch[2]} •`)), ...sscChallengeSet.filter((question) => question.origin.includes(`Classes 9–10 ${seniorMatch[2]} •`)), ...sscBoardAnalysisSet.filter((question) => question.origin.includes(`Classes 9–10 ${seniorMatch[2]} •`)), ...sscAuthoredDepth.filter((question) => question.origin.includes(`Classes 9–10 ${seniorMatch[2]} •`)), ...sscAuthoredFinal.filter((question) => question.origin.includes(`Classes 9–10 ${seniorMatch[2]} •`))] : questions;
  return [track, ensureMinimumQuestions(enriched, { classKey: seniorMatch?.[1] })];
}));

const issues = [];
const authoredCoverage = [];
for (const [track, questions] of Object.entries(tracks)) {
  const ids = new Set(); const prompts = new Set(); const levels = { easy: 0, medium: 0, hard: 0 };
  for (const question of questions) {
    const prompt = question.prompt.trim().toLocaleLowerCase();
    const options = question.options.map((option) => option.trim());
    levels[getDifficulty(question)] += 1;
    if (ids.has(question.id)) issues.push(`${track}: duplicate id ${question.id}`);
    if (prompts.has(prompt)) issues.push(`${track}: duplicate prompt ${question.id}`);
    if (!question.id.trim() || !question.prompt.trim() || !question.explanation.trim() || !question.topic.trim() || !question.chapter.trim()) issues.push(`${track}: missing content in ${question.id}`);
    if (question.answer < 0 || question.answer >= options.length) issues.push(`${track}: invalid answer in ${question.id}`);
    if (options.length < 3 || new Set(options).size !== options.length) issues.push(`${track}: invalid options in ${question.id}`);
    if (!question.sourceUrl.startsWith("https://")) issues.push(`${track}: invalid source in ${question.id}`);
    const reviewedSenior = !question.practiceVariantOf && (question.id.startsWith("ssc-std-") || question.id.startsWith("ssc-challenge-") || question.id.startsWith("ssc-analysis-") || question.id.startsWith("ssc-deep-") || question.id.startsWith("ssc-final-") || question.id.startsWith("c9-board-") || question.id.startsWith("c10-board-"));
    if (reviewedSenior) {
      if (!question.difficulty || !question.cognitiveLevel) issues.push(`${track}: reviewed SSC question lacks level metadata in ${question.id}`);
      if (question.options.length !== 4) issues.push(`${track}: reviewed SSC question must have four options in ${question.id}`);
      if (question.prompt.trim().length < 28) issues.push(`${track}: reviewed SSC prompt is too shallow in ${question.id}`);
      if (question.explanation.trim().length < 36) issues.push(`${track}: reviewed SSC explanation is too short in ${question.id}`);
      if (question.difficulty === "hard" && question.cognitiveLevel !== "analysis") issues.push(`${track}: hard SSC question must require analysis in ${question.id}`);
      if (!question.boardStyle) issues.push(`${track}: reviewed SSC question lacks board-style metadata in ${question.id}`);
      if (question.difficulty === "hard" && !["stimulus", "multi-step", "inference"].includes(question.boardStyle)) issues.push(`${track}: hard SSC question lacks higher-order board style in ${question.id}`);
    }
    ids.add(question.id); prompts.add(prompt);
  }
  if (Object.values(levels).some((count) => count === 0)) issues.push(`${track}: a challenge level has no questions`);
  const chapterCounts = new Map();
  for (const question of questions) chapterCounts.set(question.chapterNo, (chapterCounts.get(question.chapterNo) ?? 0) + 1);
  for (const [chapterNo, count] of chapterCounts) if (count < 30) issues.push(`${track}: chapter ${chapterNo} has ${count} questions; minimum is 30`);
  const authored = questions.filter((question) => !question.practiceVariantOf).length;
  authoredCoverage.push(`${track}: ${authored} authored + ${questions.length - authored} practice variants`);
  for (const level of ["easy", "medium", "hard"]) {
    for (const requested of [5, 10, 15, 20, 25, 30, 40, 50, 70]) {
      const practice = buildPracticeQuestions(questions, requested, level, () => 0.42);
      const expected = Math.min(requested, questions.length);
      if (practice.length !== expected) issues.push(`${track}: requested ${requested} ${level}, received ${practice.length} instead of ${expected}`);
      if (new Set(practice.map((question) => question.id)).size !== practice.length) issues.push(`${track}: duplicate question in ${requested}-question ${level} practice`);
      const strictPool = questions.filter((question) => getDifficulty(question) === level);
      const strictPractice = buildPracticeQuestions(strictPool, requested, level, () => 0.42);
      if (strictPractice.some((question) => getDifficulty(question) !== level)) issues.push(`${track}: ${level} practice contains a mismatched level`);
      if (strictPractice.length !== Math.min(requested, strictPool.length)) issues.push(`${track}: strict ${level} count is incorrect`);
    }
  }
}

const total = Object.values(tracks).reduce((sum, questions) => sum + questions.length, 0);
if (issues.length) {
  console.error(`Content verification failed with ${issues.length} issue(s):\n${issues.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Content verified: ${total} questions across ${Object.keys(tracks).length} subject tracks.`);
  console.log(`Authored coverage:\n${authoredCoverage.join("\n")}`);
}
