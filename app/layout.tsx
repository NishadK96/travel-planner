import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kottayam 4-Day Route Planner",
  description: "An optimized four-day field visit plan starting from Kottayam with three branches per day.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
