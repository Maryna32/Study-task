import { BookText } from "lucide-react";
import { Title, Dropmenu } from "@/components/index";
import Link from "next/link";

function Header() {
  return (
    <div className="flex items-center justify-between w-full px-8 py-5 border-b border-[var(--border)] bg-[var(--card)]">
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
