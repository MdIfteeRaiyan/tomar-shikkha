import type { ScienceQuestion } from "@/data/class-8-science";

export type AuditSubject = {
  classKey: string;
  subject: string;
  total: number;
  passed: number;
  issues: number;
  chapters: number;
  sourceCoverage: number;
  authored: number;
  practiceVariants: number;
};

export type ContentAudit = {
  total: number;
  passed: number;
  issues: number;
  sourceCoverage: number;
  subjects: AuditSubject[];
};

const isQuestionValid = (question: ScienceQuestion) => {
  // Capitalization can be the learning objective in English questions, so case changes are meaningful.
  const cleanOptions = question.options.map((option) => option.trim());
  return Boolean(
    question.id.trim() &&
    question.prompt.trim() &&
    question.explanation.trim() &&
    question.topic.trim() &&
    question.chapter.trim() &&
    question.chapterNo > 0 &&
    question.options.length >= 3 &&
    new Set(cleanOptions).size === cleanOptions.length &&
    question.answer >= 0 &&
    question.answer < question.options.length &&
    question.origin.trim() &&
    /^https:\/\//.test(question.sourceUrl)
  );
};

export function auditCurriculum<TClass extends string, TSubject extends string>(catalog: Record<TClass, Partial<Record<TSubject, { label: string; questions: ScienceQuestion[] }>>>): ContentAudit {
  const subjects: AuditSubject[] = [];
  const classGroups = Object.entries(catalog) as [string, Partial<Record<TSubject, { label: string; questions: ScienceQuestion[] }>>][];
  for (const [classKey, classSubjects] of classGroups) {
    for (const subject of Object.values(classSubjects).filter((entry): entry is { label: string; questions: ScienceQuestion[] } => Boolean(entry))) {
      const valid = subject.questions.filter(isQuestionValid).length;
      const sourced = subject.questions.filter((question) => /^https:\/\//.test(question.sourceUrl)).length;
      subjects.push({
        classKey,
        subject: subject.label,
        total: subject.questions.length,
        passed: valid,
        issues: subject.questions.length - valid,
        chapters: new Set(subject.questions.map((question) => question.chapterNo)).size,
        sourceCoverage: subject.questions.length ? Math.round((sourced / subject.questions.length) * 100) : 0,
        authored: subject.questions.filter((question) => !question.practiceVariantOf).length,
        practiceVariants: subject.questions.filter((question) => Boolean(question.practiceVariantOf)).length,
      });
    }
  }
  const total = subjects.reduce((sum, subject) => sum + subject.total, 0);
  const passed = subjects.reduce((sum, subject) => sum + subject.passed, 0);
  const sourced = subjects.reduce((sum, subject) => sum + subject.total * subject.sourceCoverage / 100, 0);
  return { total, passed, issues: total - passed, sourceCoverage: total ? Math.round((sourced / total) * 100) : 0, subjects };
}
