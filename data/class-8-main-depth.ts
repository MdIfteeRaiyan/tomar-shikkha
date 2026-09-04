import type { ScienceQuestion as Q } from "./class-8-science";
const sourceUrl="https://nctb.gov.bd/pages/static-pages/695b9858c4774958d7b703d8";
const q=(id:string,prompt:string,options:string[],answer:number,explanation:string,topic:string,chapter:string,chapterNo:number,subject:string):Q=>({id,prompt,options,answer,explanation,topic,chapter,chapterNo,origin:`NCTB 2026 • Class 8 ${subject} • ${chapter}`,sourceUrl});

export const class8MathDepth:Q[]=[
q("m8d-6-01","x+7=15 হলে x কত?",["6","7","8","22"],2,"সমীকরণের দুই পাশ থেকে ৭ বিয়োগ করলে x=১৫−৭=৮।","সরল সমীকরণ","বীজগণিতের প্রয়োগ",6,"Mathematics"),
q("m8d-6-02","a=3 ও b=2 হলে 2a+b-এর মান কত?",["5","6","8","10"],2,"a ও b-এর মান বসালে 2a+b=২×৩+২=৮।","রাশির মান","বীজগণিতের প্রয়োগ",6,"Mathematics"),
q("m8d-6-03","x²−16-এর সঠিক উৎপাদক কোনটি?",["(x−4)(x+4)","(x−8)(x+2)","(x−4)²","(x−16)(x+1)"],0,"বর্গের অন্তর সূত্রে x²−4²=(x−4)(x+4)।","উৎপাদক","বীজগণিতের প্রয়োগ",6,"Mathematics"),
q("m8d-7-04","একটি ত্রিভুজের কোণগুলোর অনুপাত 2:3:4 হলে সবচেয়ে বড় কোণ কত?",["40°","60°","80°","90°"],2,"মোট অংশ ৯ এবং মোট কোণ ১৮০°; প্রতি অংশ ২০°। সবচেয়ে বড় কোণ=৪×২০°=৮০°।","কোণের অনুপাত","জ্যামিতিক যুক্তি",7,"Mathematics"),
q("m8d-7-05","ব্যাসার্ধ ৭ cm বৃত্তের পরিধি কত? (π=22/7)",["22 cm","44 cm","49 cm","154 cm"],1,"পরিধি=2πr=২×২২/৭×৭=৪৪ cm।","বৃত্তের পরিধি","জ্যামিতিক যুক্তি",7,"Mathematics")];

export const class8EnglishDepth:Q[]=[
q("e8d-6-01","Complete: The news ___ surprising.",["are","were","is","have"],2,"News looks plural but is treated as a singular uncountable noun, so is is correct.","Subject-verb agreement","Grammar and communication",6,"English"),
q("e8d-6-02","Choose the correct relative pronoun: The girl ___ won the race is my cousin.",["which","who","where","when"],1,"Who is used for a person and introduces information about the girl.","Relative pronoun","Grammar and communication",6,"English"),
q("e8d-6-03","Reported speech of ‘Rafi said, “I can swim.”’ is—",["Rafi said that I can swim.","Rafi said that he could swim.","Rafi says he swimming.","Rafi said that he can swam."],1,"I changes to he and can usually changes to could after a past reporting verb.","Reported speech","Grammar and communication",6,"English"),
q("e8d-7-04","Read: ‘The library was quiet, yet every seat was occupied.’ What does ‘yet’ show?",["Cause","Contrast","Time","Example"],1,"Yet contrasts the quiet setting with the fact that all seats were occupied.","Connector","Critical reading",7,"English"),
q("e8d-7-05","Which sentence best summarizes a paragraph about saving water?",["Water is transparent.","Small daily actions can reduce water waste.","I like blue bottles.","Rain fell yesterday."],1,"A summary states the central message briefly; the second option captures the idea of practical water conservation.","Summary","Critical reading",7,"English")];

export const class8BanglaDepth:Q[]=[
q("b8d-6-01","‘সে দ্রুত দৌড়াল’—‘দ্রুত’ কোন পদ?",["বিশেষ্য","বিশেষণ","ক্রিয়াবিশেষণ","সর্বনাম"],2,"দ্রুত শব্দটি দৌড়ানোর ধরন বোঝায়, তাই এটি ক্রিয়াবিশেষণ।","ক্রিয়াবিশেষণ","ব্যাকরণ ও প্রয়োগ",6,"Bangla"),
q("b8d-6-02","‘বইটি রহিমের’—‘রহিমের’ কোন কারক?",["কর্তৃকারক","কর্মকারক","সম্বন্ধ পদ","অধিকরণ কারক"],2,"রহিমের শব্দটি বইয়ের সঙ্গে মালিকানার সম্পর্ক বোঝায়, তাই এটি সম্বন্ধ পদ।","সম্বন্ধ পদ","ব্যাকরণ ও প্রয়োগ",6,"Bangla"),
q("b8d-6-03","‘যদিও বৃষ্টি হচ্ছিল, তবু তারা খেলল’—বাক্যটি কোন ধরনের?",["সরল","জটিল","যৌগিক","অসম্পূর্ণ"],1,"যদিও...তবু দিয়ে একটি আশ্রিত ও একটি প্রধান খণ্ডবাক্য যুক্ত হয়েছে, তাই এটি জটিল বাক্য।","জটিল বাক্য","ব্যাকরণ ও প্রয়োগ",6,"Bangla"),
q("b8d-7-04","‘অরণ্যে রোদন’ বাগধারার অর্থ কী?",["বনে কান্না","নিষ্ফল আবেদন","প্রকৃতির সৌন্দর্য","ভয় পাওয়া"],1,"যে আবেদন বা কথা কেউ শোনে না এবং ফল হয় না, তাকে অরণ্যে রোদন বলা হয়।","বাগধারা","শব্দ ও সাহিত্যবোধ",7,"Bangla"),
q("b8d-7-05","কোন বাক্যে শব্দটি রূপক অর্থে ব্যবহৃত হয়েছে?",["আকাশে চাঁদ উঠেছে।","মেয়েটি পরিবারের চাঁদ।","চাঁদের আলো সাদা।","চাঁদ পৃথিবীর উপগ্রহ।"],1,"পরিবারের চাঁদ বাক্যে চাঁদ দিয়ে প্রিয় ও উজ্জ্বল ব্যক্তিকে বোঝানো হয়েছে—এটি রূপক ব্যবহার।","রূপক অর্থ","শব্দ ও সাহিত্যবোধ",7,"Bangla")];

export const class8BgsDepth:Q[]=[
q("g8d-6-01","আইনের শাসন বলতে কী বোঝায়?",["শুধু ক্ষমতাবানদের জন্য আইন","সবাই আইনের অধীন","আইন না মানা","ব্যক্তির ইচ্ছাই আইন"],1,"আইনের শাসনে নাগরিক ও প্রতিষ্ঠান—সবাই একই আইনি কাঠামোর অধীন থাকে।","আইনের শাসন","রাষ্ট্র ও নাগরিকতা",6,"BGS"),
q("g8d-6-02","মৌলিক অধিকার রক্ষায় স্বাধীন বিচার বিভাগের ভূমিকা কী?",["ন্যায়বিচার ও আইনি প্রতিকার দেওয়া","নির্বাচন পরিচালনা","কর আদায়","রাস্তা নির্মাণ"],0,"বিচার বিভাগ আইন ব্যাখ্যা করে এবং অধিকার লঙ্ঘিত হলে আইনি প্রতিকার দিতে পারে।","বিচার বিভাগ","রাষ্ট্র ও নাগরিকতা",6,"BGS"),
q("g8d-6-03","সামাজিক বৈচিত্র্যের প্রতি সম্মান কী তৈরি করে?",["সংঘাত","সহাবস্থান ও সম্প্রীতি","বৈষম্য","অবিশ্বাস"],1,"ভিন্ন ভাষা, সংস্কৃতি ও মতকে সম্মান করলে শান্তিপূর্ণ সহাবস্থান ও সম্প্রীতি বাড়ে।","সামাজিক বৈচিত্র্য","রাষ্ট্র ও নাগরিকতা",6,"BGS"),
q("g8d-7-04","জলবায়ু পরিবর্তনের সঙ্গে মানিয়ে নেওয়ার উদাহরণ কোনটি?",["উপকূলে লবণসহিষ্ণু ফসল চাষ","বন উজাড়","পানি অপচয়","খালে বর্জ্য ফেলা"],0,"লবণাক্ততা বাড়লে লবণসহিষ্ণু ফসল ব্যবহার ক্ষতি কমাতে সাহায্য করে—এটি adaptation।","জলবায়ু অভিযোজন","অর্থনীতি, পরিবেশ ও নিরাপত্তা",7,"BGS"),
q("g8d-7-05","ঘূর্ণিঝড়ের আগে verified তথ্যের সবচেয়ে ভালো উৎস কোনটি?",["অজানা social post","সরকারি আবহাওয়া ও দুর্যোগ নির্দেশনা","অযাচাইকৃত voice message","পুরোনো ছবি"],1,"সরকারি আবহাওয়া অধিদপ্তর ও দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষের আপডেট যাচাইকৃত সিদ্ধান্ত নিতে সাহায্য করে।","তথ্য যাচাই","অর্থনীতি, পরিবেশ ও নিরাপত্তা",7,"BGS")];
