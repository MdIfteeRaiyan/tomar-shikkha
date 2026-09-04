export const metadata = { title: "ব্যবহারের নিয়ম | TomarShikkha", description: "TomarShikkha ব্যবহারের সহজ নিয়ম ও educational disclaimer।" };

export default function TermsPage() {
  return <main className="info-page"><div className="info-top"><Link href="/">← TomarShikkha</Link><span>Last updated: September 2026</span></div><article className="info-card"><p className="eyebrow">LEARN SAFELY</p><h1>ব্যবহারের সহজ নিয়ম</h1><p>TomarShikkha practice ও revision-এর সহায়ক platform। এটি স্কুল, শিক্ষক, official textbook বা পরীক্ষার নির্দেশনার বিকল্প নয়।</p>
    <section className="info-section"><h2>শেখার জন্য ব্যবহার</h2><p>উত্তর মুখস্থ করার বদলে explanation পড়ো এবং NCTB বইয়ের chapter-এর সঙ্গে মিলিয়ে নাও। কোনো question ভুল বা অস্পষ্ট মনে হলে “প্রশ্নে সমস্যা?” দিয়ে report করো।</p></section>
    <section className="info-section"><h2>Content ও curriculum</h2><p>Questions NCTB curriculum-এর chapter ও concept ধরে তৈরি, কিন্তু ভুল একেবারে অসম্ভব নয়। Textbook edition, school instruction এবং official notice-কে চূড়ান্ত reference হিসেবে ধরতে হবে।</p></section>
    <section className="info-section"><h2>Stars ও virtual rewards</h2><p>Power Stars, chocolate, candy, teddy বা trophy শুধু learning motivation-এর virtual item। এগুলো কেনা যায় না, cash বা বাস্তব পণ্যে বদলানো যায় না।</p></section>
    <section className="info-section"><h2>ভালো digital behaviour</h2><ul><li>অন্যের account বা progress ব্যবহার করবে না।</li><li>Personal information feedback-এ লিখবে না।</li><li>Guardian ছোটদের account ও screen-time দেখবেন।</li></ul></section>
  </article></main>;
}
import Link from "next/link";
