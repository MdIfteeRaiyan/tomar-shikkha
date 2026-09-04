import type { ScienceQuestion as Q } from "./class-8-science";
const sourceUrl="https://nctb.gov.bd/pages/static-pages/695b9a68c4774958d7b707a5";
const q=(id:string,prompt:string,options:string[],answer:number,explanation:string,topic:string,chapter:string,chapterNo:number,subject:string):Q=>({id,prompt,options,answer,explanation,topic,chapter,chapterNo,origin:`NCTB 2026 • Class 5 ${subject} • ${chapter}`,sourceUrl});

export const class5EnglishDepth:Q[]=[
q("e5d-4-01","Choose the correct pronoun: Rina is my friend. ___ is kind.",["He","She","It","They"],1,"Rina is a girl’s name, so the pronoun She replaces Rina.","Pronoun","Grammar: People and actions",4,"English"),
q("e5d-4-03","Complete: We ___ football every afternoon.",["plays","play","playing","played tomorrow"],1,"The plural subject We takes the base verb play in the simple present.","Simple present","Grammar: People and actions",4,"English"),
q("e5d-4-05","Which sentence describes an action happening now?",["I read every day.","I am reading now.","I read yesterday.","I will read tomorrow."],1,"Am reading is the present continuous form and shows an action happening now.","Present continuous","Grammar: People and actions",4,"English"),
q("e5d-5-01","Choose the correct preposition: The book is ___ the table.",["on","at","from","with"],0,"On is used when something rests on a surface.","Preposition","Reading and communication",5,"English"),
q("e5d-5-03","Which word best completes the request? ‘___ I borrow your pencil, please?’",["May","Did","Was","Has"],0,"May I... is a polite way to ask for permission.","Polite request","Reading and communication",5,"English"),
q("e5d-5-05","Read: ‘Mina waters the plant every morning.’ Why does the plant stay fresh?",["Mina waters it regularly.","It sleeps all day.","It has no leaves.","Mina keeps it in a box."],0,"The sentence says Mina gives the plant water every morning, which helps it stay fresh.","Reading comprehension","Reading and communication",5,"English")];

export const class5BanglaDepth:Q[]=[
q("b5d-4-01","‘ছেলেরা মাঠে খেলছে’—‘খেলছে’ কোন পদ?",["বিশেষ্য","সর্বনাম","ক্রিয়া","বিশেষণ"],2,"খেলছে শব্দটি কাজ বোঝায়, তাই এটি ক্রিয়া।","ক্রিয়া","পদ ও বাক্যের কাজ",4,"Bangla"),
q("b5d-4-03","‘সবুজ পাতা’—‘পাতা’ কোন পদ?",["বিশেষ্য","বিশেষণ","ক্রিয়া","অব্যয়"],0,"পাতা একটি বস্তুর নাম, তাই এটি বিশেষ্য। সবুজ পাতার গুণ বোঝায়।","বিশেষ্য","পদ ও বাক্যের কাজ",4,"Bangla"),
q("b5d-4-05","‘তারা মন দিয়ে পড়ে’—‘মন দিয়ে’ কী বোঝাচ্ছে?",["কে পড়ছে","কী পড়ছে","কীভাবে পড়ছে","কখন পড়ছে"],2,"মন দিয়ে শব্দগুচ্ছটি পড়ার ধরন বা কীভাবে কাজটি হচ্ছে তা বোঝায়।","ক্রিয়ার ধরন","পদ ও বাক্যের কাজ",4,"Bangla"),
q("b5d-5-01","‘নদী’-এর সমার্থক শব্দ কোনটি?",["তটিনী","পাহাড়","সাগর","মেঘ"],0,"তটিনী শব্দের অর্থ নদী, তাই এটি নদীর সমার্থক শব্দ।","সমার্থক শব্দ","শব্দ নিয়ে খেলা",5,"Bangla"),
q("b5d-5-03","‘যে সত্য কথা বলে’—এক কথায় কী?",["মিথ্যাবাদী","সত্যবাদী","অলস","সাহসী"],1,"যিনি সত্য কথা বলেন, তাঁকে সত্যবাদী বলা হয়।","এক কথায় প্রকাশ","শব্দ নিয়ে খেলা",5,"Bangla"),
q("b5d-5-05","কোন বাক্যটি শুদ্ধ?",["আমি স্কুলে যায়।","আমি স্কুলে যাই।","আমি স্কুল যাইছে।","আমি স্কুলে যাও।"],1,"আমি কর্তার সঙ্গে বর্তমান কালের সঠিক ক্রিয়ারূপ যাই ব্যবহৃত হয়।","শুদ্ধ বাক্য","শব্দ নিয়ে খেলা",5,"Bangla")];

export const class5BgsDepth:Q[]=[
q("g5d-4-01","বাংলাদেশের জাতীয় ফুল কোনটি?",["গোলাপ","শাপলা","জবা","সূর্যমুখী"],1,"শাপলা বাংলাদেশের জাতীয় ফুল। এটি দেশের নদী-খাল ও জলাভূমিতে জন্মে।","জাতীয় প্রতীক","দেশ ও সংস্কৃতি",4,"BGS"),
q("g5d-4-03","পহেলা বৈশাখ কী?",["বাংলা নববর্ষের প্রথম দিন","বিজয় দিবস","স্বাধীনতা দিবস","ভাষা দিবস"],0,"পহেলা বৈশাখ বাংলা সালের প্রথম দিন এবং বাঙালির একটি গুরুত্বপূর্ণ সাংস্কৃতিক উৎসব।","বাংলা নববর্ষ","দেশ ও সংস্কৃতি",4,"BGS"),
q("g5d-4-05","ঐতিহাসিক স্থান রক্ষা করা কেন জরুরি?",["অতীত ও সংস্কৃতি জানতে","শুধু ছবি তুলতে","জায়গা নষ্ট করতে","গাছ কাটতে"],0,"ঐতিহাসিক স্থান আমাদের অতীত, পরিচয় ও সংস্কৃতি সম্পর্কে জানতে সাহায্য করে।","ঐতিহ্য সংরক্ষণ","দেশ ও সংস্কৃতি",4,"BGS"),
q("g5d-5-01","রাস্তা পার হওয়ার নিরাপদ নিয়ম কোনটি?",["দৌড়ে পার হওয়া","দুই দিক দেখে নির্দিষ্ট স্থান দিয়ে পার হওয়া","মোবাইল দেখে হাঁটা","চলন্ত গাড়ির সামনে যাওয়া"],1,"রাস্তা পার হওয়ার আগে ডানে-বামে দেখে zebra crossing বা নিরাপদ নির্দিষ্ট স্থান ব্যবহার করা উচিত।","সড়ক নিরাপত্তা","নিরাপদ জীবন",5,"BGS"),
q("g5d-5-03","আগুন লাগলে শিশুর প্রথম কাজ কী হওয়া উচিত?",["লুকিয়ে থাকা","বিশ্বস্ত বড় মানুষকে জানিয়ে নিরাপদে বের হওয়া","লিফটে ওঠা","আগুনের কাছে যাওয়া"],1,"আগুন দেখলে দ্রুত বড়দের সতর্ক করে নির্ধারিত নিরাপদ পথে বের হতে হবে; লিফট ব্যবহার করা যাবে না।","অগ্নিনিরাপত্তা","নিরাপদ জীবন",5,"BGS"),
q("g5d-5-05","অনলাইনে অপরিচিত কেউ ঠিকানা চাইলে কী করবে?",["সঙ্গে সঙ্গে দেবে","ছবি ও password দেবে","দেবে না এবং guardian-কে জানাবে","বন্ধুদের কাছেও পাঠাবে"],2,"ব্যক্তিগত তথ্য অপরিচিত কাউকে দেওয়া নিরাপদ নয়। এমন অনুরোধ পেলে guardian বা বিশ্বস্ত বড় মানুষকে জানাতে হবে।","অনলাইন নিরাপত্তা","নিরাপদ জীবন",5,"BGS")];
