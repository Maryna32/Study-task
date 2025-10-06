"use client";

import { useEffect, useState } from "react";
import { links } from "@/utils/links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Dropmenu() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Помилка виходу");
    } else {
      toast.success("Ви вийшли з акаунту");
      setIsLoggedIn(false);
      router.push("/");
    }
  };

  if (isLoggedIn === null) return null;

  return (
    <div className="ml-auto mr-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 border-none shadow-none hover:bg-transparent"
          >
            <Menu className="w-40 h-40" strokeWidth={3} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-40 bg-white"
          align="center"
          sideOffset={10}
        >
          {links.map((link) => (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {isLoggedIn ? (
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Вийти
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login" className="w-full cursor-pointer">
                Увійти
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Dropmenu;
