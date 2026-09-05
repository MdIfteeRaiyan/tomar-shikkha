import type { ScienceQuestion } from "./class-8-science";

const sourceUrl = "https://nctb.gov.bd/pages/static-pages/695b9858c4774958d7b703d8";
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string, topic: string, chapter: string, chapterNo: number, subject: string, difficulty: "medium" | "hard", cognitiveLevel: "application" | "analysis"): ScienceQuestion => ({ id, prompt, options, answer, explanation, topic, chapter, chapterNo, origin: `NCTB 2026 • Classes 9–10 ${subject} • Chapter ${chapterNo}: ${chapter}`, sourceUrl, difficulty, cognitiveLevel, boardStyle: cognitiveLevel === "analysis" ? "inference" : "application" });

export const sscStandardScience: ScienceQuestion[] = [
  q("ssc-std-s-01", "একটি গাছকে ২৪ ঘণ্টা অন্ধকারে রেখে পাতার অংশবিশেষ কালো কাগজে ঢেকে রোদে রাখা হলো। আয়োডিন পরীক্ষায় কোন অংশ নীল-কালো হবে?", ["ঢাকা অংশ", "আলো পাওয়া অংশ", "দুই অংশই", "কোনো অংশই নয়"], 1, "আলো পাওয়া অংশে সালোকসংশ্লেষ হয়ে শ্বেতসার তৈরি হয়; আয়োডিনের সঙ্গে সেটিই নীল-কালো হয়।", "সালোকসংশ্লেষ পরীক্ষা", "জীবন প্রক্রিয়া", 5, "Science", "hard", "analysis"),
  q("ssc-std-s-02", "৬ Ω রোধের মধ্য দিয়ে ২ A বিদ্যুৎ প্রবাহিত হলে দুই প্রান্তের বিভব পার্থক্য কত?", ["৩ V", "৮ V", "১২ V", "২৪ V"], 2, "ওহমের সূত্র অনুযায়ী বিভব পার্থক্য V=IR। অতএব V=২ A×৬ Ω=১২ V।", "ওহমের সূত্র", "বিদ্যুৎ", 12, "Science", "medium", "application"),
];

export const sscStandardMath: ScienceQuestion[] = [
  q("ssc-std-m-01", "x²−7x+10=0 সমীকরণের মূল দুটি α ও β হলে α²+β² কত?", ["১৯", "২৯", "৩৯", "৪৯"], 1, "α+β=৭ এবং αβ=১০। তাই α²+β²=(α+β)²−2αβ=৪৯−২০=২৯।", "দ্বিঘাত সমীকরণ", "বীজগণিত", 4, "Mathematics", "hard", "analysis"),
  q("ssc-std-m-02", "একটি সমকোণী ত্রিভুজের লম্ব ও ভূমি ৬ cm ও ৮ cm। অতিভুজের ওপর অঙ্কিত বর্গের ক্ষেত্রফল কত?", ["৪৮ cm²", "৬৪ cm²", "১০০ cm²", "১৪৪ cm²"], 2, "পিথাগোরাসের সূত্রে অতিভুজ²=৬²+৮²=১০০; অতিভুজের ওপর বর্গের ক্ষেত্রফলও ১০০ cm²।", "পিথাগোরাসের উপপাদ্য", "জ্যামিতি", 8, "Mathematics", "medium", "application"),
];

export const sscStandardEnglish: ScienceQuestion[] = [
  q("ssc-std-e-01", "Choose the correct completion: Had the driver been more careful, the accident ___.", ["will not happen", "would not happen", "would not have happened", "did not happen"], 2, "A past unreal condition uses had + past participle, followed by would have + past participle.", "Third conditional", "Grammar", 8, "English", "hard", "analysis"),
  q("ssc-std-e-02", "Which sentence correctly reports: Rina said, ‘I have finished my assignment’?", ["Rina said that I have finished my assignment.", "Rina said that she had finished her assignment.", "Rina says that she finished my assignment.", "Rina told that she has finished her assignment."], 1, "In reported speech, I changes to she, my to her, and present perfect normally backshifts to past perfect.", "Narration", "Grammar", 11, "English", "medium", "application"),
];

export const sscStandardBangla: ScienceQuestion[] = [
  q("ssc-std-b-01", "‘যদিও সে দরিদ্র, তবু সে সৎ’—বাক্যটির সরল রূপ কোনটি?", ["সে দরিদ্র কিন্তু সৎ।", "দরিদ্র হলেও সে সৎ।", "সে দরিদ্র এবং সৎ।", "সে দরিদ্র বলে সৎ।"], 1, "‘দরিদ্র হলেও সে সৎ’—এখানে একটি সমাপিকা ক্রিয়া থাকায় এটি সরল বাক্য এবং মূল অর্থও অক্ষুণ্ণ।", "বাক্য রূপান্তর", "বাক্যতত্ত্ব", 9, "Bangla", "hard", "analysis"),
  q("ssc-std-b-02", "‘শিক্ষক ছাত্রকে বই দিলেন’—বাক্যে ‘ছাত্রকে’ কোন কারক?", ["কর্তৃকারক", "কর্মকারক", "সম্প্রদান কারক", "অধিকরণ কারক"], 2, "যাকে স্বত্বত্যাগ করে কিছু দেওয়া হয়, সে সম্প্রদান কারক; এখানে ছাত্র বইটি গ্রহণ করছে।", "কারক", "ব্যাকরণ", 7, "Bangla", "medium", "application"),
];

export const sscStandardBgs: ScienceQuestion[] = [
  q("ssc-std-g-01", "ঘূর্ণিঝড়ের সতর্কসংকেতের পর উপকূলীয় একটি পরিবার প্রথমে কোন সমন্বিত পদক্ষেপ নেবে?", ["সম্পদ পাহারা দিতে ঘরে থাকবে", "গুজব ছড়াবে", "জরুরি ব্যাগ নিয়ে নির্ধারিত আশ্রয়কেন্দ্রে যাবে", "নদীর কাছে পরিস্থিতি দেখতে যাবে"], 2, "সরকারি নির্দেশনা মেনে জরুরি প্রয়োজনীয় জিনিসসহ আশ্রয়কেন্দ্রে যাওয়া জীবনরক্ষাকারী প্রস্তুতি।", "দুর্যোগ প্রস্তুতি", "দুর্যোগ ব্যবস্থাপনা", 10, "BGS", "medium", "application"),
  q("ssc-std-g-02", "একটি স্থানীয় রাস্তা মেরামতের জন্য নাগরিকরা সবচেয়ে সরাসরি কোন প্রতিষ্ঠানের কাছে জবাবদিহি চাইতে পারে?", ["জাতিসংঘ", "স্থানীয় সরকার প্রতিষ্ঠান", "সুপ্রিম কোর্ট", "কেন্দ্রীয় ব্যাংক"], 1, "স্থানীয় অবকাঠামো ও সেবার বিষয়ে সংশ্লিষ্ট ইউনিয়ন পরিষদ, পৌরসভা বা সিটি করপোরেশন সরাসরি দায়িত্বশীল।", "নাগরিক অংশগ্রহণ", "রাষ্ট্র ও নাগরিকতা", 6, "BGS", "hard", "analysis"),
];

export const sscStandardPhysics: ScienceQuestion[] = [
  q("ssc-std-p-01", "স্থির অবস্থা থেকে ২ m/s² ত্বরণে ৫ s চললে বস্তুটির অতিক্রান্ত দূরত্ব কত?", ["১০ m", "২০ m", "২৫ m", "৫০ m"], 2, "সমত্বরণের সূত্র s=ut+½at²। এখানে u=০, তাই s=½×২×৫²=২৫ m।", "সমত্বরণ", "গতি", 2, "Physics", "medium", "application"),
  q("ssc-std-p-02", "একই ভোল্টেজে ৬ Ω ও ৩ Ω রোধ পৃথকভাবে যুক্ত করা হলো। কোন রোধে ক্ষমতা বেশি এবং কত গুণ?", ["৬ Ω-এ, ২ গুণ", "৩ Ω-এ, ২ গুণ", "৬ Ω-এ, ৪ গুণ", "দুটিতে সমান"], 1, "স্থির V-এর জন্য P=V²/R। রোধ অর্ধেক হলে ক্ষমতা দ্বিগুণ, তাই ৩ Ω রোধে ক্ষমতা ২ গুণ।", "বৈদ্যুতিক ক্ষমতা", "চলবিদ্যুৎ", 12, "Physics", "hard", "analysis"),
];

export const sscStandardChemistry: ScienceQuestion[] = [
  q("ssc-std-c-01", "STP-তে ১১.২ L অক্সিজেন গ্যাসে কত mol O₂ থাকে?", ["০.২৫ mol", "০.৫০ mol", "১.০ mol", "২.০ mol"], 1, "STP-তে ১ mol গ্যাসের আয়তন ২২.৪ L; তাই ১১.২/২২.৪=০.৫০ mol।", "মোলার আয়তন", "মোলের ধারণা", 6, "Chemistry", "medium", "application"),
  q("ssc-std-c-02", "2H₂ + O₂ → 2H₂O বিক্রিয়ায় ৪ mol H₂ সম্পূর্ণ বিক্রিয়ার জন্য কত mol O₂ প্রয়োজন?", ["১ mol", "২ mol", "৩ mol", "৪ mol"], 1, "সমীকরণে H₂:O₂ অনুপাত ২:১; তাই ৪ mol H₂-এর জন্য ২ mol O₂ প্রয়োজন।", "স্টয়কিওমেট্রি", "রাসায়নিক বিক্রিয়া", 7, "Chemistry", "hard", "analysis"),
];

export const sscStandardBiology: ScienceQuestion[] = [
  q("ssc-std-bio-01", "Tt × Tt সংকরায়ণে খর্ব (tt) সন্তানের সম্ভাবনা কত?", ["০%", "২৫%", "৫০%", "৭৫%"], 1, "Punnett square-এ TT:Tt:tt = ১:২:১; তাই tt হওয়ার সম্ভাবনা ১/৪ বা ২৫%।", "একসংকর জনন", "বংশগতি", 11, "Biology", "hard", "analysis"),
  q("ssc-std-bio-02", "অতিরিক্ত সার পুকুরে মিশে শৈবাল দ্রুত বাড়লে মাছ মারা যাওয়ার সবচেয়ে প্রত্যক্ষ কারণ কী?", ["পানির লবণাক্ততা শূন্য হয়", "পচনে দ্রবীভূত অক্সিজেন কমে যায়", "পানির তাপমাত্রা সবসময় কমে", "মাছের খাদ্য সঙ্গে সঙ্গে শেষ হয়"], 1, "অতিরিক্ত শৈবাল মারা গিয়ে পচলে অণুজীব অক্সিজেন ব্যবহার করে; দ্রবীভূত অক্সিজেনের ঘাটতিতে মাছ মারা যায়।", "ইউট্রোফিকেশন", "জীব ও পরিবেশ", 12, "Biology", "medium", "application"),
];

export const sscStandardHigherMath: ScienceQuestion[] = [
  q("ssc-std-hm-01", "A(2,−1) ও B(8,5) রেখাংশের মধ্যবিন্দুর স্থানাঙ্ক কোনটি?", ["(৩,২)", "(৫,২)", "(৫,৩)", "(১০,৪)"], 1, "মধ্যবিন্দু=((২+৮)/২,(−১+৫)/২)=(৫,২)।", "মধ্যবিন্দু", "স্থানাঙ্ক জ্যামিতি", 11, "Higher Mathematics", "medium", "application"),
  q("ssc-std-hm-02", "যদি tan θ=3/4 এবং θ সূক্ষ্মকোণ হয়, তবে sin θ কত?", ["৩/৫", "৪/৫", "৩/৪", "৫/৪"], 0, "৩–৪–৫ সমকোণী ত্রিভুজে বিপরীত বাহু ৩ ও অতিভুজ ৫; তাই sin θ=৩/৫।", "ত্রিকোণমিতিক অনুপাত", "ত্রিকোণমিতি", 8, "Higher Mathematics", "hard", "analysis"),
];

export const sscStandardIct: ScienceQuestion[] = [
  q("ssc-std-ict-01", "দশমিক ৪৫-এর বাইনারি রূপ কোনটি?", ["101011", "101101", "110101", "111001"], 1, "৪৫=৩২+৮+৪+১, তাই ২⁵ থেকে ২⁰ বিটগুলো 101101।", "সংখ্যা পদ্ধতি", "ডিজিটাল ডিভাইস", 3, "ICT", "medium", "application"),
  q("ssc-std-ict-02", "একটি login system-এ password plain text হিসেবে database-এ রাখা হয়েছে। সবচেয়ে গুরুত্বপূর্ণ উন্নতি কোনটি?", ["Password ছোট করা", "Password hash ও salt ব্যবহার করা", "সব user-কে একই password দেওয়া", "Database public করা"], 1, "Salt-সহ শক্তিশালী one-way hash ব্যবহার করলে database ফাঁস হলেও আসল password সরাসরি প্রকাশ পায় না।", "তথ্য নিরাপত্তা", "নিরাপদ ব্যবহার", 6, "ICT", "hard", "analysis"),
];

// Second reviewed SSC set: these are distinct applications, not wording-only variants.
sscStandardScience.push(
  q("ssc-std-s-03", "একটি ১০০ W বৈদ্যুতিক বাতি প্রতিদিন ৫ ঘণ্টা করে ৩০ দিন জ্বললে কত বৈদ্যুতিক শক্তি খরচ হবে?", ["১৫ kWh", "৫০ kWh", "১৫০ kWh", "১৫০০ kWh"], 0, "শক্তি=ক্ষমতা×সময়=০.১ kW×(৫×৩০) h=১৫ kWh।", "বৈদ্যুতিক শক্তি", "বিদ্যুৎ", 12, "Science", "medium", "application"),
  q("ssc-std-s-04", "pH ৩-এর দ্রবণের তুলনায় pH ৫-এর দ্রবণে H⁺ আয়নের ঘনমাত্রা কত গুণ কম?", ["২ গুণ", "১০ গুণ", "১০০ গুণ", "১০০০ গুণ"], 2, "pH-এর প্রতি একক পরিবর্তনে H⁺ ঘনমাত্রা ১০ গুণ বদলায়; দুই এককে ১০²=১০০ গুণ।", "pH স্কেল", "অম্ল, ক্ষারক ও লবণ", 9, "Science", "hard", "analysis"),
  q("ssc-std-s-05", "একটি খাদ্যশৃঙ্খলে ঘাস→ঘাসফড়িং→ব্যাঙ→সাপ। কীটনাশকে ঘাসফড়িং কমে গেলে প্রথমে কোন পরিবর্তনটি সবচেয়ে সম্ভাব্য?", ["ব্যাঙের খাদ্য কমবে", "ঘাস সঙ্গে সঙ্গে বিলুপ্ত হবে", "সাপের সংখ্যা সঙ্গে সঙ্গে বাড়বে", "বিয়োজক কাজ বন্ধ করবে"], 0, "ঘাসফড়িং ব্যাঙের সরাসরি খাদ্য; তাই প্রথম প্রভাব হিসেবে ব্যাঙের খাদ্যপ্রাপ্যতা কমবে।", "খাদ্যশৃঙ্খল", "পরিবেশ ও জীবজগৎ", 10, "Science", "hard", "analysis"),
);

sscStandardMath.push(
  q("ssc-std-m-03", "একটি সমান্তর ধারার ৫ম পদ ১৮ এবং ৯ম পদ ৩০। সাধারণ অন্তর কত?", ["২", "৩", "৪", "৬"], 1, "a+4d=১৮ এবং a+8d=৩০; বিয়োগ করে 4d=১২, তাই d=৩।", "সমান্তর ধারা", "বীজগণিত", 11, "Mathematics", "hard", "analysis"),
  q("ssc-std-m-04", "দুটি সংখ্যার অনুপাত ৩:৫ এবং তাদের গসাগু ৪ হলে সংখ্যা দুটির লসাগু কত?", ["২০", "৪০", "৬০", "৮০"], 2, "সহমৌলিক অনুপাত ৩:৫ হলে সংখ্যা ১২ ও ২০; লসাগু ৬০।", "গসাগু ও লসাগু", "বাস্তব সংখ্যা", 1, "Mathematics", "medium", "application"),
  q("ssc-std-m-05", "একটি বৃত্তের কেন্দ্র থেকে ১৩ cm দূরের বিন্দু থেকে অঙ্কিত স্পর্শকের দৈর্ঘ্য ১২ cm। ব্যাসার্ধ কত?", ["৫ cm", "৭ cm", "১২ cm", "২৫ cm"], 0, "ব্যাসার্ধ স্পর্শকের ওপর লম্ব। তাই r²+১২²=১৩²; r=৫ cm।", "বৃত্তের স্পর্শক", "বৃত্ত", 8, "Mathematics", "hard", "analysis"),
);

sscStandardEnglish.push(
  q("ssc-std-e-03", "Choose the correct transformation: ‘As soon as the bell rang, the students left the room.’", ["No sooner did the bell ring when the students left.", "No sooner had the bell rung than the students left.", "No sooner the bell rang than students leave.", "Hardly the bell rang and the students left."], 1, "The standard structure is No sooner had + subject + past participle + than + past simple.", "Sentence transformation", "Grammar", 8, "English", "hard", "analysis"),
  q("ssc-std-e-04", "Complete the sentence: The teacher insisted that every student ___ the assignment on time.", ["submits", "submitted", "submit", "will submit"], 2, "After insisted that, formal English uses the base-form subjunctive: submit.", "Subjunctive", "Grammar", 11, "English", "hard", "analysis"),
  q("ssc-std-e-05", "Which connector best completes the argument? ‘The road was flooded; ___, the rescue team reached the village.’", ["because", "nevertheless", "therefore", "unless"], 1, "Nevertheless introduces a result that contrasts with the difficult condition stated before it.", "Logical connector", "Writing", 13, "English", "medium", "analysis"),
);

sscStandardBangla.push(
  q("ssc-std-b-03", "‘যে পরিশ্রম করে, সে সফল হয়’—বাক্যটির সরল রূপ কোনটি?", ["পরিশ্রমী ব্যক্তি সফল হয়।", "পরিশ্রম করে এবং সফল হয়।", "সে পরিশ্রম করে কিন্তু সফল হয়।", "যেহেতু পরিশ্রম করে তাই সফল হয়।"], 0, "‘পরিশ্রমী ব্যক্তি সফল হয়’ বাক্যে একটি সমাপিকা ক্রিয়া আছে এবং মূল বক্তব্য অক্ষুণ্ণ রয়েছে।", "বাক্য রূপান্তর", "বাক্যতত্ত্ব", 9, "Bangla", "hard", "analysis"),
  q("ssc-std-b-04", "‘রাজপুত্র’ শব্দটি কোন সমাসের উদাহরণ?", ["কর্মধারয়", "দ্বন্দ্ব", "ষষ্ঠী তৎপুরুষ", "বহুব্রীহি"], 2, "রাজপুত্র-এর ব্যাসবাক্য ‘রাজার পুত্র’; পূর্বপদে ষষ্ঠী বিভক্তি লোপ পেয়েছে।", "সমাস", "শব্দ গঠন", 8, "Bangla", "medium", "application"),
  q("ssc-std-b-05", "‘নদীটি যেন রুপার ফিতা’—এখানে কোন অলংকারের প্রয়োগ হয়েছে?", ["উপমা", "রূপক", "অনুপ্রাস", "শ্লেষ"], 0, "‘যেন’ উপমাবাচক শব্দ দিয়ে নদীকে রুপার ফিতার সঙ্গে তুলনা করা হয়েছে।", "অলংকার", "সাহিত্য ও ভাষা", 10, "Bangla", "medium", "analysis"),
);

sscStandardBgs.push(
  q("ssc-std-g-03", "একটি প্রকল্পে স্থানীয় জনগণের মতামত না নিয়ে জলাভূমি ভরাট করা হলো। টেকসই উন্নয়নের কোন নীতিটি সবচেয়ে বেশি উপেক্ষিত?", ["অংশগ্রহণ ও পরিবেশ সুরক্ষা", "শুধু মুনাফা বৃদ্ধি", "জনসংখ্যা বৃদ্ধি", "আমদানি নিয়ন্ত্রণ"], 0, "টেকসই উন্নয়নে পরিবেশ রক্ষা এবং সিদ্ধান্তে প্রভাবিত জনগোষ্ঠীর অংশগ্রহণ—দুটিই গুরুত্বপূর্ণ।", "টেকসই উন্নয়ন", "অর্থনীতি ও উন্নয়ন", 9, "BGS", "hard", "analysis"),
  q("ssc-std-g-04", "সংবিধানে মৌলিক অধিকার থাকা নাগরিককে প্রধানত কী সুরক্ষা দেয়?", ["রাষ্ট্রীয় ক্ষমতার স্বেচ্ছাচার থেকে আইনি সুরক্ষা", "কর না দেওয়ার স্বাধীনতা", "আইন অমান্যের অনুমতি", "অন্যের অধিকার হরণের সুযোগ"], 0, "মৌলিক অধিকার ব্যক্তির স্বাধীনতা ও মর্যাদাকে রাষ্ট্রের বেআইনি হস্তক্ষেপ থেকে সুরক্ষা দেয়।", "মৌলিক অধিকার", "রাষ্ট্র ও নাগরিকতা", 6, "BGS", "medium", "application"),
  q("ssc-std-g-05", "কোনো এলাকার জনসংখ্যা দ্রুত বাড়লেও কর্মসংস্থান ও সেবা না বাড়লে সবচেয়ে সম্ভাব্য সামাজিক ফল কী?", ["নির্ভরতার চাপ ও বেকারত্ব বাড়বে", "সবার আয় সমান হবে", "দারিদ্র্য স্বয়ংক্রিয়ভাবে দূর হবে", "প্রাকৃতিক সম্পদ বেড়ে যাবে"], 0, "কর্মসংস্থান ও সেবা একই হারে না বাড়লে নির্ভরশীলতা, বেকারত্ব এবং মৌলিক সেবার ওপর চাপ বাড়ে।", "জনসংখ্যা ও সম্পদ", "সামাজিক কাঠামো", 7, "BGS", "hard", "analysis"),
);

sscStandardPhysics.push(
  q("ssc-std-p-03", "২০ m/s বেগে উল্লম্বভাবে ওপরে নিক্ষিপ্ত বস্তুর সর্বোচ্চ উচ্চতা কত? (g=10 m/s²)", ["১০ m", "২০ m", "৩০ m", "৪০ m"], 1, "সর্বোচ্চ বিন্দুতে v=০। v²=u²−2gh থেকে h=২০²/(২×১০)=২০ m।", "উল্লম্ব গতি", "গতি", 2, "Physics", "hard", "analysis"),
  q("ssc-std-p-04", "২ kg ভরের বস্তু ৫ m উচ্চতা থেকে পড়লে ভূমি স্পর্শের ঠিক আগে গতিশক্তি কত হবে? (g=10 m/s², বায়ুর বাধা উপেক্ষা)", ["২৫ J", "৫০ J", "১০০ J", "২০০ J"], 2, "শক্তির সংরক্ষণে গতিশক্তি=mgh=২×১০×৫=১০০ J।", "শক্তির সংরক্ষণ", "কাজ, ক্ষমতা ও শক্তি", 3, "Physics", "medium", "application"),
  q("ssc-std-p-05", "একটি উত্তল লেন্সের ফোকাস দূরত্ব ২০ cm। এর ক্ষমতা কত?", ["+২ D", "+৫ D", "−৫ D", "+২০ D"], 1, "f=০.২০ m; P=1/f=+৫ D। উত্তল লেন্সের ক্ষমতা ধনাত্মক।", "লেন্সের ক্ষমতা", "আলোর প্রতিসরণ", 8, "Physics", "medium", "application"),
);

sscStandardChemistry.push(
  q("ssc-std-c-03", "২৩ g Na-তে কত mol পরমাণু আছে? (Na-এর আপেক্ষিক পারমাণবিক ভর ২৩)", ["০.৫ mol", "১ mol", "২ mol", "২৩ mol"], 1, "পদার্থের পরিমাণ mol=প্রদত্ত ভর/মোলার ভর। তাই ২৩ g/২৩ g mol⁻¹=১ mol।", "মোল গণনা", "মোলের ধারণা", 6, "Chemistry", "medium", "application"),
  q("ssc-std-c-04", "Cl-এর পারমাণবিক সংখ্যা ১৭। Cl⁻ আয়নে মোট ইলেকট্রন কতটি?", ["১৬", "১৭", "১৮", "৩৪"], 2, "নিরপেক্ষ Cl-এ ১৭টি electron; −১ আধান পেতে একটি electron গ্রহণ করে, মোট ১৮টি।", "আয়ন গঠন", "পরমাণুর গঠন", 2, "Chemistry", "medium", "application"),
  q("ssc-std-c-05", "একই পর্যায়ে বাম থেকে ডানে গেলে সাধারণত পারমাণবিক ব্যাসার্ধ কমে কেন?", ["নিউক্লীয় আধান বাড়ে কিন্তু নতুন প্রধান শক্তিস্তর যোগ হয় না", "প্রোটন সংখ্যা কমে", "নিউট্রন সবসময় শূন্য হয়", "ইলেকট্রন স্তর অসীম হয়"], 0, "একই shell-এ electron যোগ হলেও কার্যকর নিউক্লীয় আকর্ষণ বাড়ে, তাই electron cloud নিউক্লিয়াসের দিকে সঙ্কুচিত হয়।", "পর্যায়বৃত্ত ধর্ম", "পর্যায় সারণি", 2, "Chemistry", "hard", "analysis"),
);

sscStandardBiology.push(
  q("ssc-std-bio-03", "উদ্ভিদকোষকে ঘন লবণ দ্রবণে রাখলে কোষঝিল্লি কোষপ্রাচীর থেকে সরে যায় কেন?", ["Endosmosis", "Exosmosis", "সক্রিয় পরিবহন", "প্রকাশ-সংশ্লেষ"], 1, "বাইরের দ্রবণ hypertonic হওয়ায় পানি exosmosis-এ বের হয় এবং plasmolysis ঘটে।", "প্লাজমোলাইসিস", "কোষ ও টিস্যু", 1, "Biology", "hard", "analysis"),
  q("ssc-std-bio-04", "একজন মানুষের অগ্ন্যাশয় পর্যাপ্ত insulin তৈরি না করলে কোন পরিবর্তনটি প্রত্যাশিত?", ["রক্তে glucose বেড়ে যাবে", "রক্তে glucose শূন্য হবে", "শ্বাসক্রিয়া বন্ধ হবে", "রক্তের group বদলাবে"], 0, "Insulin কোষে glucose গ্রহণ ও রক্তের glucose নিয়ন্ত্রণে সাহায্য করে; ঘাটতিতে hyperglycemia হয়।", "হরমোন", "সমন্বয়", 9, "Biology", "medium", "application"),
  q("ssc-std-bio-05", "DNA-এর একটি strand-এর sequence ATGCC হলে complementary strand কোনটি?", ["ATGCC", "TACGG", "UACGG", "GGCAT"], 1, "DNA base-pairing-এ A-এর সঙ্গে T এবং G-এর সঙ্গে C যুক্ত হয়; তাই TACGG।", "DNA base pairing", "বংশগতি", 11, "Biology", "medium", "application"),
);

sscStandardHigherMath.push(
  q("ssc-std-hm-03", "f(x)=2x−3 ফাংশনের বিপরীত ফাংশনে input 7 দিলে output কত হবে?", ["২", "৫", "৭", "১১"], 1, "f(x)=৭ ধরলে ২x−৩=৭, তাই x=৫। সুতরাং বিপরীত ফাংশনের মান f⁻¹(৭)=৫।", "বিপরীত ফাংশন", "সেট ও ফাংশন", 1, "Higher Mathematics", "hard", "analysis"),
  q("ssc-std-hm-04", "(2,1) বিন্দুগামী এবং ঢাল ৩ বিশিষ্ট সরলরেখার সমীকরণ কোনটি?", ["y=3x−5", "y=3x+5", "y=2x−3", "y=x+1"], 0, "বিন্দু-ঢাল সূত্র y−y₁=m(x−x₁) প্রয়োগে y−1=3(x−2); সরল করলে y=3x−5।", "সরলরেখা", "স্থানাঙ্ক জ্যামিতি", 3, "Higher Mathematics", "medium", "application"),
  q("ssc-std-hm-05", "একটি বাক্সে ৩টি লাল ও ২টি নীল বল আছে। প্রতিস্থাপন ছাড়া পরপর দুটি লাল বল পাওয়ার সম্ভাবনা কত?", ["৩/১০", "২/৫", "১/২", "৩/৫"], 0, "প্রথম লাল ৩/৫ এবং এরপর লাল ২/৪; যৌথ সম্ভাবনা ৩/৫×২/৪=৩/১০।", "শর্তাধীন সম্ভাবনা", "সম্ভাবনা", 7, "Higher Mathematics", "hard", "analysis"),
);

sscStandardIct.push(
  q("ssc-std-ict-03", "A=1 ও B=0 হলে (A AND B) OR (NOT B)-এর output কত?", ["০", "১", "A", "অনির্ধারিত"], 1, "A AND B=০ এবং NOT B=১; তাই ০ OR ১=১।", "Logic gate", "ডিজিটাল ডিভাইস", 3, "ICT", "hard", "analysis"),
  q("ssc-std-ict-04", "একটি table-এ একই student ID একাধিক record-এ ব্যবহার ঠেকাতে কোন database constraint সবচেয়ে উপযুক্ত?", ["PRIMARY KEY", "ORDER BY", "DROP TABLE", "COMMENT"], 0, "PRIMARY KEY প্রতিটি record-এর জন্য unique ও non-null পরিচয় নিশ্চিত করে।", "Database constraint", "ডেটাবেজ", 4, "ICT", "medium", "application"),
  q("ssc-std-ict-05", "একটি website-এ user input সরাসরি SQL query-তে বসানো হচ্ছে। প্রধান ঝুঁকি ও প্রতিরোধ কোনটি?", ["SQL injection; parameterized query", "Phishing; বড় font", "Data loss; screenshot", "Spam; dark mode"], 0, "Untrusted input query structure বদলে SQL injection ঘটাতে পারে; parameterized query data ও command আলাদা রাখে।", "Web security", "নিরাপদ ব্যবহার", 6, "ICT", "hard", "analysis"),
);
