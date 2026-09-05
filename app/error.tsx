"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="recovery-page"><section><span><ShieldCheck size={30} /></span><p className="eyebrow">তোমার progress নিরাপদ আছে</p><h1>পাতাটি ঠিকভাবে খুলতে পারেনি</h1><p>একটু connection বা browser সমস্যার কারণে এমন হতে পারে। আবার চেষ্টা করলে সাধারণত ঠিক হয়ে যায়।</p><button onClick={reset}><RotateCcw size={17} /> আবার চেষ্টা করি</button><Link href="/">শেখার মূল পাতায় যাই</Link></section></main>;
}
