"use client";

import { QuickStatistic, Header, Congragulation } from "@/components/index";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col w-full">
        {/* Хедер */}
        <Header />

        {/* Основний контент */}
        <div className="pl-[30px] pt-[20px]">
          <Congragulation name="Mary" />

          <QuickStatistic />
        </div>
      </div>
    </>
  );
}
