// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilLine } from "lucide-react";

const nav = [
  { href: "/", label: "이야기 만들기" },
  { href: "/character", label: "캐릭터" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* 사이드바 */}
      <aside className="bg-amber-100 min-h-screen drop-shadow-md text-xl p-4">
        <nav>
          <div className="text-amber-700 flex flex-row items-center gap-2 mb-10">
            <PencilLine size={20} />
            <p>AI와 만드는 나만의 이야기</p>
          </div>
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block text-amber-700 hover:font-bold",
                  active ? "font-bold" : "font-normal",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
