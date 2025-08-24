// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleMore, Pencil, Trash2 } from "lucide-react";
import { useStoryStore } from "@/stores/story";
import Image from "next/image";

const nav = [
  { href: "/", label: "Day1" },
  { href: "/day2", label: "Day2" },
  { href: "/day3", label: "Day3" },
  { href: "/day4", label: "Day4" },
  { href: "/day5", label: "Day5" },
  { href: "/character", label: "캐릭터와 이야기하기" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const resetAll = useStoryStore((s) => s.resetAll);

  return (
    <>
      {/* 사이드바 */}
      <aside className="bg-amber-100 min-h-screen drop-shadow-md text-xl p-4 flex flex-col">
        <nav className="flex-1">
          <div className="text-amber-700 flex flex-row items-center mb-10">
            <Image src="/zebra.png" alt="Zebra" width={60} height={60} />
          </div>
          <Link
            className={[
              "text-amber-700 hover:font-bold items-center flex",
              pathname !== "/character" ? "font-bold" : "font-normal",
            ].join(" ")}
            href="/"
          >
            <Pencil size={20} className="inline mr-1" />
            이야기 만들기
          </Link>
          {nav.map((item) => {
            const active = pathname === item.href;
            const isCharacter = item.href === "/character";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center text-amber-700 rounded-full hover:font-bold",
                  active ? "font-bold" : "font-normal",
                  active && !isCharacter ? "bg-white" : "",
                  isCharacter ? "ml-0 mt-10" : "ml-8 pl-8",
                ].join(" ")}
              >
                {isCharacter ? (
                  <MessageCircleMore size={20} className="inline mr-1" />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* 초기화 버튼 */}
        <button
          onClick={resetAll}
          className="flex items-center gap-1 text-amber-700 hover:font-bold ml-auto"
        >
          <Trash2 size={12} />
          <p className="text-sm">캐릭터 초기화</p>
        </button>
      </aside>
    </>
  );
}
