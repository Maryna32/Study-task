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
  upcoming: number;
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
      <div className="p-6 border rounded-lg">
        <p className="text-muted-foreground">Завантаження статистики...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 border rounded-lg text-center space-y-3">
        <p className="text-lg font-medium">
          Для перегляду статистики увійдіть в систему
        </p>
        <Button onClick={() => router.push("/login")}>Увійти</Button>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6 border rounded-lg text-center space-y-3">
        <p className="text-lg font-medium">У вас поки немає жодного завдання</p>
        <p className="text-sm text-muted-foreground">
          Почніть додавати завдання, щоб побачити статистику
        </p>
      </div>
    );
  }

  const completionRate = Math.round((stats.done / stats.total) * 100);

  return (
    <div className="p-6 border rounded-lg space-y-4 mt-[30px]">
      <h3 className="text-xl font-bold ">Швидка статистика</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Всього завдань */}
        <div className="p-4 bg-blue-50 rounded-lg font-bold">
          <p className="text-sm text-muted-foreground ">Всього</p>
          <p className="text-2xl ">{stats.total}</p>
        </div>

        {/* Виконано */}
        <div className="p-4 bg-green-50 rounded-lg text-green-600 font-bold">
          <p className="text-sm text-muted-foreground flex items-center gap-2 ">
            Виконано
            <Check size={15} strokeWidth={5} className="relative top-[1px]" />
          </p>
          <p className="text-2xl ">{stats.done}</p>
        </div>

        {/* В процесі */}
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-600 font-bold">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            В процесі
            <PencilLine
              size={15}
              strokeWidth={3}
              className="relative top-[1px] "
            />
          </p>
          <p className="text-2xl">{stats.inProgress}</p>
        </div>

        {/* Прострочені */}
        <div className="p-4 bg-red-50  rounded-lg text-red-600 font-bold">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
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
        <div className="p-4 bg-purple-50 rounded-lg font-bold text-purple-600">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Сьогодні
            <CalendarDays
              size={15}
              strokeWidth={3}
              className="relative top-[1px]"
            />
          </p>
          <p className="text-2xl ">{stats.today}</p>
        </div>

        {/* Найближчі 7 днів */}
        <div className="p-4 bg-orange-50 rounded-lg font-bold text-orange-600">
          <p className="text-sm text-muted-foreground">Цього тижня</p>
          <p className="text-2xl">{stats.upcoming}</p>
        </div>
      </div>

      {/* Прогрес бар */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогрес виконання</span>
          <span className="font-semibold">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Високий пріоритет як акцент */}
      {stats.highPriority > 0 && (
        <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 font-semibold">
            <BookAlert size={20} strokeWidth={3} />
            <span>Завдань високого пріоритету</span>
          </div>
          <span className="text-2xl font-bold text-pink-600">
            {stats.highPriority}
          </span>
        </div>
      )}
    </div>
  );
}

export default QuickStatistic;
