import { BookText } from "lucide-react";
import { Title, Dropmenu } from "@/components/index";
import Link from "next/link";

function Header() {
  return (
    <div className="flex items-center justify-between w-full pl-[30px] pr-[20px] pt-[20px] pb-[10px] border-b border-[var(--text-secondary)]">
      <Link href="/">
        <div className="flex items-center gap-2">
          <BookText size={30} />
          <Title title="Study Task" />
        </div>
      </Link>

      <Dropmenu />
    </div>
  );
}

export default Header;
