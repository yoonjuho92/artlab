import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "나만의 이야기 만들기",
  description: "AI와 함께 하는 나만의 이야기 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
