import type { ScienceQuestion } from "../data/class-8-science";

const juniorPromptFrames = [
  (prompt: string) => prompt,
  (prompt: string) => `ধারণাটি মিলিয়ে দেখো—${prompt}`,
  (prompt: string) => `Revision check: ${prompt}`,
  (prompt: string) => `একটু ভেবে উত্তর দাও—${prompt}`,
  (prompt: string) => `Quick challenge: ${prompt}`,
  (prompt: string) => `আজকের concept check—${prompt}`,
];

const seniorPromptFrames = [
  (prompt: string) => `ধারণা প্রয়োগ করে উত্তর দাও—${prompt}`,
  (prompt: string) => `SSC concept check—${prompt}`,
  (prompt: string) => `প্রদত্ত তথ্য বিশ্লেষণ করো—${prompt}`,
  (prompt: string) => `কারণ–ফল বিবেচনা করে উত্তর দাও—${prompt}`,
  (prompt: string) => `বোর্ড প্রস্তুতি: ${prompt}`,
];

type ExpansionOptions = { minimumPerChapter?: number; classKey?: string; subjectKey?: string };

function rotateOptions(question: ScienceQuestion, offset: number) {
  if (!offset) return { options: [...question.options], answer: question.answer };
  const shift = offset % question.options.length;
  const options = [...question.options.slice(shift), ...question.options.slice(0, shift)];
  return { options, answer: (question.answer - shift + question.options.length) % question.options.length };
}

/**
 * Builds a deterministic, no-duplicate-prompt practice bank while keeping every
 * answer, explanation, chapter and NCTB reference tied to reviewed source content.
 */
export function ensureMinimumQuestions(questions: readonly ScienceQuestion[], options: number | ExpansionOptions = 30): ScienceQuestion[] {
  const config = typeof options === "number" ? { minimumPerChapter: options } : options;
  const minimumPerChapter = config.minimumPerChapter ?? 30;
  const isSenior = config.classKey === "9" || config.classKey === "10";
  const frames = isSenior ? seniorPromptFrames : juniorPromptFrames;
  const chapters = new Map<number, ScienceQuestion[]>();
  for (const question of questions) chapters.set(question.chapterNo, [...(chapters.get(question.chapterNo) ?? []), question]);

  return [...chapters.values()].flatMap((chapterQuestions) => {
    if (chapterQuestions.length >= minimumPerChapter) return [...chapterQuestions];
    const expanded = [...chapterQuestions];
    let sequence = 0;
    while (expanded.length < minimumPerChapter) {
      const source = chapterQuestions[sequence % chapterQuestions.length];
      const frameIndex = Math.floor(sequence / chapterQuestions.length) + 1;
      const frame = frames[frameIndex % frames.length];
      const { options, answer } = rotateOptions(source, frameIndex);
      expanded.push({
        ...source,
        id: `${source.id}-format-${String(frameIndex).padStart(2, "0")}-${String(expanded.length + 1).padStart(2, "0")}`,
        prompt: isSenior ? `SSC Practice ${expanded.length + 1} • ${frame(source.prompt)}` : `অনুশীলন ${expanded.length + 1} • ${frame(source.prompt)}`,
        options,
        answer,
        // Rewording or option rotation must never pretend to increase cognitive difficulty.
        difficulty: source.difficulty,
        cognitiveLevel: source.cognitiveLevel,
        practiceVariantOf: source.practiceVariantOf ?? source.id,
      });
      sequence += 1;
    }
    return expanded;
  });
}
