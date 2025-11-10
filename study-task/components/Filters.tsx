"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchSubjects } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

type Subject = {
  id: number;
  name: string;
};

const priorityOptions = [
  { value: "High", label: "Високий" },
  { value: "Medium", label: "Середній" },
  { value: "Low", label: "Низький" },
];

const doneOptions = [
  { value: "true", label: "Виконані" },
  { value: "false", label: "Невиконані" },
];

const getToken = () => {
  return getAuthToken();
};

function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [currentFilters, setCurrentFilters] = useState({
    subjectId: searchParams.get("subjectId") || "all",
    priority: searchParams.get("priority") || "all",
    done: searchParams.get("done") || "all",
  });

  useEffect(() => {
    const loadSubjects = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const data = await fetchSubjects(token);
        setSubjects(data);
      } catch (error) {
        console.error("Помилка завантаження предметів:", error);
      }
    };
    loadSubjects();
  }, []);

  const applyFilters = (key: keyof typeof currentFilters, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const basePath = pathname.startsWith("/tasks") ? pathname : "/tasks";

    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setCurrentFilters({ subjectId: "all", priority: "all", done: "all" });
    router.push(`/tasks`, { scroll: false });
  };

  return (
    <div className="flex space-x-4 mb-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Дисципліна</label>
        <Select
          value={currentFilters.subjectId}
          onValueChange={(val) => applyFilters("subjectId", val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Всі дисципліни" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Всі дисципліни</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={String(subject.id)}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Пріоритет</label>
        <Select
          value={currentFilters.priority}
          onValueChange={(val) => applyFilters("priority", val)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Будь-який пріоритет" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Всі пріоритети</SelectItem>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Статус</label>
        <Select
          value={currentFilters.done}
          onValueChange={(val) => applyFilters("done", val)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Всі статуси" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Всі завдання</SelectItem>
            {doneOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={resetFilters}>
        Скинути фільтри
      </Button>
    </div>
  );
}

export default Filters;
