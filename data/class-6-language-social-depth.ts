import type { ScienceQuestion as Q } from "./class-8-science";
const sourceUrl="https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b";
const q=(id:string,prompt:string,options:string[],answer:number,explanation:string,topic:string,chapter:string,chapterNo:number,subject:string):Q=>({id,prompt,options,answer,explanation,topic,chapter,chapterNo,origin:`NCTB 2026 • Class 6 ${subject} • ${chapter}`,sourceUrl});

export const class6EnglishDepth:Q[]=[
q("e6d-4-01","Choose the correct article: Rahim is ___ honest student.",["a","an","the only","no article"],1,"Honest begins with a vowel sound because h is silent, so an is used before it.","Article","Grammar in context",4,"English"),
q("e6d-4-03","Complete: Karim and Rafi ___ preparing their lesson.",["is","am","are","was"],2,"The subject has two people and is plural, so are is correct.","Subject-verb agreement","Grammar in context",4,"English"),
q("e6d-4-05","Which sentence is in the simple past tense?",["We visit the museum.","We visited the museum.","We are visiting the museum.","We will visit the museum."],1,"Visited is the past form and shows that the action happened before now.","Simple past","Grammar in context",4,"English"),
q("e6d-5-01","Choose the synonym of ‘begin’.",["end","start","stop","close"],1,"Begin and start both mean to commence something.","Synonym","Reading and vocabulary",5,"English"),
q("e6d-5-03","Read: ‘The sky became dark, so Nila took an umbrella.’ What did Nila expect?",["Strong sunlight","Rain","Snow","A power cut"],1,"A dark sky and an umbrella are clues that Nila expected rain.","Inference","Reading and vocabulary",5,"English"),
q("e6d-5-05","Which sentence is the clearest instruction?",["Maybe the door.","Please close the door quietly.","The door was blue.","Door and window."],1,"The sentence uses a clear action verb and politely explains what to do.","Instruction","Reading and vocabulary",5,"English")];

export const class6BanglaDepth:Q[]=[
q("b6d-4-01","‘শিশুরা আনন্দে হাসছে’—‘আনন্দে’ কী বোঝায়?",["কাজের কর্তা","কাজের কারণ বা অবস্থা","কাজের বস্তু","কাজের সময়"],1,"আনন্দে শব্দটি হাসার মানসিক অবস্থা বা কারণ বোঝাচ্ছে।","শব্দের ব্যবহার","ভাষার প্রয়োগ",4,"Bangla"),
q("b6d-4-03","‘মেঘ করেছে, তাই বৃষ্টি হতে পারে’—‘তাই’ কী কাজ করেছে?",["কারণ ও ফল যুক্ত করেছে","নাম বোঝায়","প্রশ্ন করেছে","গুণ বোঝায়"],0,"তাই শব্দটি মেঘ করার কারণের সঙ্গে বৃষ্টির সম্ভাব্য ফল যুক্ত করেছে।","যোজক","ভাষার প্রয়োগ",4,"Bangla"),
q("b6d-4-05","‘আমরা দেশকে ভালোবাসি’—‘দেশকে’ কোন কারক?",["কর্তৃকারক","কর্মকারক","করণ কারক","অধিকরণ কারক"],1,"ভালোবাসার কাজটি দেশের ওপর পড়ছে, তাই দেশকে কর্মকারক।","কর্মকারক","ভাষার প্রয়োগ",4,"Bangla"),
q("b6d-5-01","‘পরিশ্রমী’-এর বিপরীতার্থক কোনটি?",["কর্মঠ","অলস","সাহসী","সৎ"],1,"পরিশ্রমী নিয়মিত কাজ করে; তার বিপরীত অর্থ প্রকাশ করে অলস।","বিপরীতার্থক","শব্দসম্পদ",5,"Bangla"),
q("b6d-5-03","‘যিনি অন্যের উপকার করেন’—এক কথায় কী?",["পরোপকারী","স্বার্থপর","অসহিষ্ণু","কৃতঘ্ন"],0,"যিনি অন্য মানুষের উপকার করেন, তাঁকে পরোপকারী বলা হয়।","এক কথায় প্রকাশ","শব্দসম্পদ",5,"Bangla"),
q("b6d-5-05","‘এক ঢিলে দুই পাখি মারা’ বাগধারার অর্থ কী?",["পাখি শিকার করা","এক কাজে দুই ফল পাওয়া","দুইবার চেষ্টা করা","কাজ অসম্পূর্ণ রাখা"],1,"একটি কাজ বা প্রচেষ্টায় দুটি উদ্দেশ্য পূরণ হলে এই বাগধারাটি ব্যবহৃত হয়।","বাগধারা","শব্দসম্পদ",5,"Bangla")];

export const class6BgsDepth:Q[]=[
q("g6d-4-01","বাংলাদেশের জাতীয় স্মৃতিসৌধ কোথায়?",["সাভার","কুমিল্লা","সিলেট","রাঙামাটি"],0,"মুক্তিযুদ্ধে শহীদদের স্মরণে জাতীয় স্মৃতিসৌধ ঢাকার সাভারে নির্মিত হয়েছে।","জাতীয় স্মৃতিসৌধ","ইতিহাস ও ঐতিহ্য",4,"BGS"),
q("g6d-4-03","মুক্তিযুদ্ধে চূড়ান্ত বিজয় অর্জিত হয় কবে?",["২১ ফেব্রুয়ারি ১৯৫২","২৬ মার্চ ১৯৭১","১৬ ডিসেম্বর ১৯৭১","১০ জানুয়ারি ১৯৭২"],2,"১৯৭১ সালের ১৬ ডিসেম্বর পাকিস্তানি বাহিনীর আত্মসমর্পণের মাধ্যমে বাংলাদেশ চূড়ান্ত বিজয় অর্জন করে।","বিজয় দিবস","ইতিহাস ও ঐতিহ্য",4,"BGS"),
q("g6d-4-05","ঐতিহাসিক নিদর্শন সংরক্ষণে শিক্ষার্থী কী করতে পারে?",["দেয়ালে নাম লেখা","ময়লা ফেলা","নিয়ম মেনে দেখা ও ক্ষতি না করা","অংশ ভেঙে নেওয়া"],2,"নিদর্শন স্পর্শ বা নষ্ট না করে নিয়ম মানা এবং অন্যকেও সচেতন করা ঐতিহ্য রক্ষায় সাহায্য করে।","ঐতিহ্য সংরক্ষণ","ইতিহাস ও ঐতিহ্য",4,"BGS"),
q("g6d-5-01","পরিবেশ রক্ষায় কার্যকর অভ্যাস কোনটি?",["যত্রতত্র প্লাস্টিক ফেলা","পুনর্ব্যবহারযোগ্য জিনিস ব্যবহার","খালি ঘরে বাতি জ্বালানো","পানি অপচয় করা"],1,"পুনর্ব্যবহারযোগ্য জিনিস ব্যবহার করলে বর্জ্য ও প্রাকৃতিক সম্পদের অপচয় কমে।","বর্জ্য কমানো","মানুষ ও পরিবেশ",5,"BGS"),
q("g6d-5-03","বন্যার পানিতে বৈদ্যুতিক তার পড়ে থাকলে কী করবে?",["তার ছুঁয়ে দেখবে","পানিতে নামবে","দূরে থাকবে এবং বড়দের জানাবে","তার সরাতে লাঠি ব্যবহার করবে"],2,"ভেজা স্থানে বিদ্যুৎস্পৃষ্ট হওয়ার ঝুঁকি থাকে। তাই দূরে থেকে বড় মানুষ বা কর্তৃপক্ষকে জানানো নিরাপদ।","বন্যা নিরাপত্তা","মানুষ ও পরিবেশ",5,"BGS"),
q("g6d-5-05","কোন কাজটি দায়িত্বশীল digital citizenship দেখায়?",["কারও ছবি অনুমতি ছাড়া ছড়ানো","ভুয়া খবর যাচাই ছাড়া share করা","অনলাইনে সম্মানজনক ভাষা ব্যবহার","অন্যের password চাওয়া"],2,"অনলাইনেও অন্যকে সম্মান করা, তথ্য যাচাই করা এবং privacy রক্ষা করা দায়িত্বশীল আচরণ।","Digital citizenship","মানুষ ও পরিবেশ",5,"BGS")];
