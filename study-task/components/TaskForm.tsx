"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TaskFormProps {
  initialData?: {
    title: string;
    deadline?: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
    done: boolean;
    notes?: string;
    subject?: string;
  };
  onSubmit: (data: {
    title: string;
    deadline: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
    done: boolean;
    notes: string;
    subjectName: string;
  }) => void;
  submitLabel: string;
  formTitle: string;
}

export function TaskForm({
  initialData,
  onSubmit,
  submitLabel,
  formTitle,
}: TaskFormProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [taskName, setTaskName] = useState(initialData?.title || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [priorityOptions] = useState(["Високий", "Середній", "Низький"]);
  const [statusOptions] = useState(["Не розпочато", "В процесі", "Завершено"]);
  const [selectedPriority, setSelectedPriority] = useState(
    initialData
      ? initialData.priority === "HIGH"
        ? "Високий"
        : initialData.priority === "MEDIUM"
        ? "Середній"
        : "Низький"
      : "Середній"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    initialData
      ? initialData.status === "NOT_STARTED"
        ? "Не розпочато"
        : initialData.status === "IN_PROGRESS"
        ? "В процесі"
        : "Завершено"
      : "Не розпочато"
  );
  const [isDone, setIsDone] = useState(initialData?.done || false);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) return;

      const res = await fetch("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        if (json.subjects.length === 0) {
          setShowInput(true);
        } else {
          setSubjects(json.subjects);
          setSelectedSubject(initialData?.subject || json.subjects[0]);
        }
      }
    };
    fetchSubjects();
  }, [initialData]);

  const handleAddSubject = async () => {
    const name = newSubject.trim();
    if (!name) return;
    if (subjects.includes(name)) {
      toast.warning(`Предмет "${name}" вже існує`);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) return toast.error("Користувач не авторизований");

    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, token }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      setSubjects((prev) => [...prev, name]);
      setSelectedSubject(name);
      setNewSubject("");
      setShowInput(false);
      toast.success(`Додано новий предмет: ${name}`);
    } else {
      toast.error(json.error || "Помилка при створенні предмета");
    }
  };

  const toggleDone = () => {
    setIsDone((prev) => !prev);
    setSelectedStatus((prev) =>
      prev === "Завершено" ? "Не розпочато" : "Завершено"
    );
  };

  const handleSubmit = () => {
    if (!taskName.trim()) return toast.warning("Вкажіть назву завдання");
    const subjectToSend = showInput ? newSubject.trim() : selectedSubject;
    if (!subjectToSend) return toast.warning("Вкажіть предмет");

    onSubmit({
      title: taskName,
      deadline,
      priority:
        selectedPriority === "Високий"
          ? "HIGH"
          : selectedPriority === "Середній"
          ? "MEDIUM"
          : "LOW",
      status:
        selectedStatus === "Не розпочато"
          ? "NOT_STARTED"
          : selectedStatus === "В процесі"
          ? "IN_PROGRESS"
          : "DONE",
      done: isDone,
      notes,
      subjectName: subjectToSend,
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md w-[800px]">
      <h2 className="text-lg font-semibold">{formTitle}</h2>

      <Label>Виберіть предмет</Label>
      {!showInput ? (
        <div className="flex items-center gap-2">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="max-w-xs bg-white">
              <SelectValue placeholder="Оберіть предмет" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setShowInput(true)}>
            Додати предмет
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Input
            autoFocus
            type="text"
            placeholder="Назва предмету"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubject();
              if (e.key === "Escape") {
                setNewSubject("");
                setShowInput(false);
              }
            }}
          />
          <Button size="sm" onClick={handleAddSubject}>
            Підтвердити
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNewSubject("");
              setShowInput(false);
            }}
          >
            Скасувати
          </Button>
        </div>
      )}

      <Label>Назва завдання</Label>
      <Input
        value={taskName}
        className="max-w-xs"
        onChange={(e) => setTaskName(e.target.value)}
      />

      <Label>Дедлайн</Label>
      <Input
        type="datetime-local"
        className="w-[180px]"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <Label>Пріоритет</Label>
      <Select value={selectedPriority} onValueChange={setSelectedPriority}>
        <SelectTrigger className="max-w-xs bg-white">
          <SelectValue placeholder="Оберіть пріоритет" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {priorityOptions.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Статус</Label>
      <div className="flex items-center gap-3">
        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            setSelectedStatus(value);
            setIsDone(value === "Завершено");
          }}
        >
          <SelectTrigger className="max-w-xs bg-white">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isDone}
            onChange={toggleDone}
            className="w-4 h-4 accent-green-500"
          />
          Виконано
        </label>
      </div>

      <Label>Нотатки</Label>
      <textarea
        className="w-full max-w-xs h-20 p-2 border rounded-md resize-none"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex gap-5 mt-2">
        <Button size="sm" onClick={handleSubmit}>
          {submitLabel}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/tasks")}
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
