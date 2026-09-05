"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, FileCheck2, Flag, RotateCcw, Trophy } from "lucide-react";
import type { ScienceQuestion } from "@/data/class-8-science";

type TestType = "board" | "previous-style" | "school";
type SubjectPack = { key: string; label: string; questions: ScienceQuestion[] };
const typeCopy: Record<TestType, { label: string; note: string }> = {
  board: { label: "Board Pattern", note: "NCTB-aligned application ও analysis question" },
  "previous-style": { label: "Previous-year Style", note: "পুরোনো পরীক্ষার ধরন অনুসরণে তৈরি original practice" },
  school: { label: "School Standard", note: "Class test ও term-exam style mixed practice" },
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function ModelTestCenter({ classKey, subjects, onBack }: { classKey: string; subjects: SubjectPack[]; onBack: () => void }) {
  const [subjectKey, setSubjectKey] = useState(subjects[0]?.key ?? "");
  const [testType, setTestType] = useState<TestType>(Number(classKey) >= 9 ? "board" : "school");
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(20);
  const [questions, setQuestions] = useState<ScienceQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [stage, setStage] = useState<"setup" | "running" | "result">("setup");
  const durationRef = useRef(0);
  const selected = subjects.find((subject) => subject.key === subjectKey) ?? subjects[0];
  const eligible = useMemo(() => {
    const source = selected?.questions ?? [];
    if (testType === "board") return source.filter((question) => question.boardStyle || question.cognitiveLevel === "analysis");
    if (testType === "previous-style") return source.filter((question) => question.difficulty === "hard" || question.cognitiveLevel === "application");
    return source.filter((question) => question.difficulty !== "hard" || !question.difficulty);
  }, [selected, testType]);
  const availableCount = Math.min(count, eligible.length || selected?.questions.length || 0);
  const finish = () => setStage("result");

  useEffect(() => {
    if (stage !== "running") return;
    const deadline = Date.now() + durationRef.current * 1000;
    const timer = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) { window.clearInterval(timer); setStage("result"); }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  const start = () => {
    const pool = eligible.length ? eligible : selected.questions;
    setQuestions(shuffle(pool).slice(0, Math.min(count, pool.length)));
    durationRef.current = minutes * 60;
    setAnswers({}); setCurrent(0); setRemaining(durationRef.current); setStage("running");
  };
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  const answered = Object.keys(answers).length;

  if (stage === "running") {
    const question = questions[current];
    return <div className="shell model-test-page"><div className="exam-topbar"><div><span>{typeCopy[testType].label}</span><strong>Class {classKey} • {selected.label}</strong></div><div className={`exam-timer ${remaining <= 60 ? "urgent" : ""}`} role="timer" aria-live="polite"><Clock3 size={18} /> {formatTime(remaining)}</div><button onClick={finish}>Test জমা দিই</button></div>
      <div className="exam-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <section className="exam-card"><div className="exam-question-meta"><span>প্রশ্ন {current + 1}/{questions.length}</span><span>{question.chapter}</span></div><h1>{question.prompt}</h1><div className="exam-options">{question.options.map((option, index) => <button key={option} className={answers[current] === index ? "selected" : ""} onClick={() => setAnswers((value) => ({ ...value, [current]: index }))}><span>{String.fromCharCode(65 + index)}</span>{option}{answers[current] === index && <Check size={18} />}</button>)}</div><div className="exam-actions"><button disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}><ArrowLeft size={17} /> আগেরটি</button><span>{answered}/{questions.length} answered</span>{current === questions.length - 1 ? <button className="primary" onClick={finish}>শেষ করি <Flag size={17} /></button> : <button className="primary" onClick={() => setCurrent((value) => value + 1)}>পরেরটি <ArrowRight size={17} /></button>}</div></section>
      <div className="exam-navigator" aria-label="Question navigator">{questions.map((_, index) => <button key={index} className={`${index === current ? "current" : ""} ${answers[index] !== undefined ? "answered" : ""}`} onClick={() => setCurrent(index)} aria-label={`প্রশ্ন ${index + 1}`}>{index + 1}</button>)}</div>
    </div>;
  }

  if (stage === "result") {
    const percentage = Math.round((score / Math.max(1, questions.length)) * 100);
    return <div className="shell model-test-page"><button className="tool-back" onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><section className="exam-result"><Trophy size={42} /><p className="eyebrow">MODEL TEST COMPLETE</p><h1>{score}/{questions.length}</h1><strong>{percentage >= 80 ? "দারুণ exam readiness!" : percentage >= 60 ? "ভালো—আরেকটু revision করলে ready" : "ভুলগুলো বুঝে আবার চেষ্টা করো"}</strong><p>{answered}টি answered • {questions.length - answered}টি unanswered</p><button onClick={() => setStage("setup")}><RotateCcw size={17} /> নতুন Test দিই</button></section><div className="exam-review"><h2>Answer Review</h2>{questions.map((question, index) => <article key={question.id} className={answers[index] === question.answer ? "correct" : "wrong"}><span>{index + 1}</span><div><h3>{question.prompt}</h3><p><b>সঠিক:</b> {question.options[question.answer]}</p>{answers[index] !== undefined && answers[index] !== question.answer && <p><b>তোমার উত্তর:</b> {question.options[answers[index]]}</p>}<small>{question.explanation}</small></div></article>)}</div></div>;
  }

  return <div className="shell model-test-page"><div className="tool-page-top"><button onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><span>Exam practice</span></div><section className="model-test-hero"><div><p className="eyebrow">MODEL TEST CENTER</p><h1>সময় ধরে নিজের প্রস্তুতি যাচাই করো</h1><p>Test চলার সময় answer দেখানো হবে না। শেষে score, ভুল ও explanation একসঙ্গে পাবে।</p></div><FileCheck2 size={48} /></section>
    <section className="model-test-builder"><label>বিষয়<select value={subjectKey} onChange={(event) => setSubjectKey(event.target.value)}>{subjects.map((subject) => <option key={subject.key} value={subject.key}>{subject.label}</option>)}</select></label><div><span className="builder-label">Question set</span><div className="test-type-grid">{(Object.keys(typeCopy) as TestType[]).map((type) => <button key={type} className={testType === type ? "active" : ""} onClick={() => setTestType(type)}><strong>{typeCopy[type].label}</strong><small>{typeCopy[type].note}</small></button>)}</div></div><div className="model-test-settings"><label>প্রশ্ন<select value={count} onChange={(event) => setCount(Number(event.target.value))}>{[10,20,30,40].filter((value) => value <= Math.max(10, eligible.length)).map((value) => <option key={value} value={value}>{value}টি</option>)}</select></label><label>সময়<select value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}>{[10,20,30,45].map((value) => <option key={value} value={value}>{value} মিনিট</option>)}</select></label></div><div className="model-test-ready"><div><strong>{availableCount}টি প্রশ্ন ready</strong><span>{typeCopy[testType].note}</span></div><button disabled={!availableCount} onClick={start}>Model Test শুরু করি <ArrowRight size={18} /></button></div><p className="source-honesty">“Previous-year Style” প্রশ্নগুলো past-exam pattern অনুসরণে তৈরি original practice; verified original paper নয়।</p></section>
  </div>;
}
