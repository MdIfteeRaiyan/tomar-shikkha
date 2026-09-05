import type { ScienceQuestion } from "@/data/class-8-science";

export type Difficulty = "easy" | "medium" | "hard";

export const getDifficulty = (question: ScienceQuestion): Difficulty => {
  if (question.difficulty) return question.difficulty;
  if (question.cognitiveLevel === "analysis") return "hard";
  if (question.cognitiveLevel === "application") return "medium";
  if (/NCTB 2026 • Class(?:es)? (?:9|10|9–10)/.test(question.origin)) return "easy";
  const match = question.id.match(/(\d+)$/);
  const sequence = match ? Number(match[1]) : 1;
  return sequence <= 2 ? "easy" : sequence <= 4 ? "medium" : "hard";
};

export const shuffleQuestions = <T,>(items: readonly T[], random = Math.random): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

export function buildPracticeQuestions(
  questions: readonly ScienceQuestion[],
  requestedCount: number,
  preferredDifficulty: Difficulty,
  random = Math.random,
) {
  const safeCount = Number.isFinite(requestedCount) ? Math.max(1, Math.floor(requestedCount)) : 10;
  const preferred = questions.filter((question) => getDifficulty(question) === preferredDifficulty);
  const remaining = questions.filter((question) => getDifficulty(question) !== preferredDifficulty);
  const reviewedSenior = preferred.filter((question) => question.id.startsWith("ssc-std-"));
  const otherPreferred = preferred.filter((question) => !question.id.startsWith("ssc-std-"));

  // The chosen level sets the emphasis; it must never shrink a 70-question request to 2–3 questions.
  return [...shuffleQuestions(reviewedSenior, random), ...shuffleQuestions(otherPreferred, random), ...shuffleQuestions(remaining, random)].slice(
    0,
    Math.min(safeCount, questions.length),
  );
}
