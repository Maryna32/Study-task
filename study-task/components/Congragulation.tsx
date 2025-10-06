"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function Congratulation() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const name = (user.user_metadata?.full_name as string) || "Користувач";
        setUserName(name);
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          (session.user.user_metadata?.full_name as string) || "Користувач";
        setUserName(name);
      } else {
        setUserName(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!userName) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mt-[10px]">
      <div className="text-lg font-semibold">Привіт, {userName}!</div>
    </div>
  );
}

export default Congratulation;
