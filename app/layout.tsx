import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TomarShikkha — তোমার শেখা, তোমার গতিতে",
  description: "বাংলাদেশের শিক্ষার্থীদের জন্য NCTB curriculum-grounded adaptive learning platform.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}</body></html>;
}
