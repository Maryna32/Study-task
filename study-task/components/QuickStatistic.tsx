"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Check,
  PencilLine,
  TriangleAlert,
  CalendarDays,
  BookAlert,
} from "lucide-react";

type TaskStats = {
  total: number;
  done: number;
  inProgress: number;
  overdue: number;
  today: number;
  thisWeek: number;
  highPriority: number;
};

function QuickStatistic() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const { data: session } = await supabase.auth.getSession();
        const token = session.session?.access_token;

        const res = await fetch("/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Помилка отримання статистики:", error);
      }

      setLoading(false);
    };

    checkAuthAndFetchStats();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        checkAuthAndFetchStats();
      } else {
        setIsAuthenticated(false);
        setStats(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-lg">
        <p className="text-muted-foreground">Завантаження статистики...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-lg text-center space-y-3">
        <p className="text-lg font-medium">
          Для перегляду статистики увійдіть в систему
        </p>
        <Button
          className="w-fit bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          onClick={() => router.push("/login")}
        >
          Увійти
        </Button>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6 rounded-lg text-center space-y-3">
        <p className="text-lg font-medium">У вас поки немає жодного завдання</p>
        <p className="text-sm text-muted-foreground">
          Почніть додавати завдання, щоб побачити статистику
        </p>
      </div>
    );
  }

  const completionRate = Math.round((stats.done / stats.total) * 100);

  return (
    <div className="p-6 rounded-lg space-y-4 mt-[30px] ml-0 pl-0">
      <h3 className="text-xl font-bold">Швидка статистика</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Всього завдань */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-blue-400 font-bold">
          <p className="text-sm opacity-70">Всього</p>
          <p className="text-2xl">{stats.total}</p>
        </div>

        {/* Виконано */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-green-400 font-bold">
          <p className="text-sm opacity-70 flex items-center gap-2">
            Виконано
            <Check size={15} strokeWidth={5} className="relative top-[1px]" />
          </p>
          <p className="text-2xl">{stats.done}</p>
        </div>

        {/* В процесі */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-yellow-400 font-bold">
          <p className="text-sm opacity-70 flex items-center gap-2">
            В процесі
            <PencilLine
              size={15}
              strokeWidth={3}
              className="relative top-[1px]"
            />
          </p>
          <p className="text-2xl">{stats.inProgress}</p>
        </div>

        {/* Прострочені */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-red-400 font-bold">
          <p className="text-sm opacity-70 flex items-center gap-2">
            Прострочені
            <TriangleAlert
              size={15}
              strokeWidth={3}
              className="relative top-[1px]"
            />
          </p>
          <p className="text-2xl">{stats.overdue}</p>
        </div>

        {/* Сьогодні */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-purple-400 font-bold">
          <p className="text-sm opacity-70 flex items-center gap-2">
            Сьогодні
            <CalendarDays
              size={15}
              strokeWidth={3}
              className="relative top-[1px]"
            />
          </p>
          <p className="text-2xl">{stats.today}</p>
        </div>

        {/* Найближчі 7 днів */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-orange-400 font-bold">
          <p className="text-sm opacity-70">Цього тижня</p>
          <p className="text-2xl">{stats.thisWeek}</p>
        </div>
      </div>

      {/* Прогрес бар */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогрес виконання</span>
          <span className="font-semibold">{completionRate}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Високий пріоритет як акцент */}
      {stats.highPriority > 0 && (
        <div className="p-4 bg-slate-800/40 border-2 border-pink-700/50 rounded-lg flex items-center justify-between text-pink-400 font-semibold">
          <div className="flex items-center gap-2">
            <BookAlert size={20} strokeWidth={3} />
            <span>Завдань високого пріоритету</span>
          </div>
          <span className="text-2xl font-bold">{stats.highPriority}</span>
        </div>
      )}
    </div>
  );
}

export default QuickStatistic;
