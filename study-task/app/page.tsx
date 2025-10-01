"use client";

import { BookText } from "lucide-react";
import { Title, QuickStatistic } from "@/components/index";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div>
        <Link href="/">
          <div className="flex items-center pl-[30px] pt-[20px] pb-[10px] border-b border-[var(--text-secondary)]">
            <BookText size={30} />
            <Title title="Study Task" />
          </div>
        </Link>
      </div>
      <div>
        <QuickStatistic />
      </div>
    </>
  );
}
