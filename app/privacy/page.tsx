export const metadata = { title: "Privacy | TomarShikkha", description: "TomarShikkha কী তথ্য রাখে এবং কীভাবে ব্যবহার করে—সহজ ভাষায়।" };

export default function PrivacyPage() {
  return <main className="info-page"><div className="info-top"><Link href="/">← TomarShikkha</Link><span>Last updated: September 2026</span></div><article className="info-card"><p className="eyebrow">PRIVACY, MADE SIMPLE</p><h1>তোমার শেখা, তোমার তথ্য</h1><p>TomarShikkha শিশু ও guardian-এর privacy-কে গুরুত্ব দেয়। নিচে সহজ ভাষায় বলা হলো কোন তথ্য কোথায় থাকে।</p>
    <section className="info-section"><h2>Device-এ কী থাকে</h2><p>Guest হিসেবে ব্যবহার করলে learner profile, practice result, Quest Stars এবং virtual trophy এই browser-এর local storage-এ থাকে। Browser data মুছে ফেললে এগুলোও মুছে যেতে পারে।</p></section>
    <section className="info-section"><h2>Cloud backup চালু করলে</h2><p>Guardian email দিয়ে sign in করলে learner profile, practice history, Daily Quest completion, rewards এবং question reports Supabase-এ guardian account-এর অধীনে save হয়। শিশুর email প্রয়োজন হয় না।</p></section>
    <section className="info-section"><h2>আমরা কী চাই না</h2><ul><li>শিশুর পূর্ণ নাম, ঠিকানা, স্কুলের নাম বা ফোন নম্বর লিখবেন না।</li><li>TomarShikkha বিজ্ঞাপনের জন্য student data বিক্রি করে না।</li><li>Virtual chocolate, candy বা toy বাস্তব পণ্য নয় এবং কোনো অর্থমূল্য নেই।</li></ul></section>
    <section className="info-section"><h2>Guardian-এর নিয়ন্ত্রণ</h2><p>Guardian device data মুছতে browser storage clear করতে পারেন। Cloud data সরানোর অনুরোধ Feedback page থেকে পাঠানো যাবে; account যাচাই ছাড়া অন্য কারও data দেওয়া বা মুছে ফেলা হবে না।</p></section>
  </article></main>;
}
import Link from "next/link";
