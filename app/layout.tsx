import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiruvalla 3-Day Route Planner",
  description: "A practical three-day field visit plan for 12 Thiruvalla-assigned destinations.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
