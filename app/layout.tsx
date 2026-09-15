import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiruvalla 4-Day Route Planner",
  description: "A practical four-day field visit plan with a maximum of three branches per day.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
