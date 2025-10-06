"use client";
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
import { useState } from "react";

function AddTask() {
  const [subjects, setSubjects] = useState([
    "Математика",
    "Фізика",
    "Хімія",
    "Історія",
    "Англійська",
  ]);
  const [priority, setPriority] = useState(["Високий", "Середній", "Низький"]);
  const [statusOptions] = useState(["Не розпочато", "В процесі", "Завершено"]);

  const [selected, setSelected] = useState(subjects[0]);
  const [selectedPriority, setSelectedPriority] = useState(priority[1]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  const [showInput, setShowInput] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [notes, setNotes] = useState("");

  const handleAddSubject = () => {
    const name = newSubject.trim();
    if (!name) return;

    if (subjects.includes(name)) {
      toast.warning(`Предмет "${name}" вже існує`);
      return;
    }

    setSubjects((prev) => [...prev, name]);
    setSelected(name);
    toast.success(`Додано новий предмет: ${name}`);
    setNewSubject("");
    setShowInput(false);
  };

  const toggleDone = () => {
    setIsDone((prev) => !prev);
    setSelectedStatus((prev) =>
      prev === "Завершено" ? "Не розпочато" : "Завершено"
    );
  };

  const handleSaveTask = async () => {
    if (!taskName.trim()) {
      toast.warning("Вкажіть назву завдання");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Користувач не авторизований");
      return;
    }

    const token = session.access_token;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
        subjectName: selected,
        token,
      }),
    });

    if (res.ok) {
      toast.success("Завдання збережено!");
      setTaskName("");
      setDeadline("");
      setSelectedPriority(priority[1]);
      setSelectedStatus(statusOptions[0]);
      setIsDone(false);
      setNotes("");
    } else {
      const error = await res.json();
      toast.error(error.message || "Помилка при збереженні завдання");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md w-[800px]">
      <h2 className="text-lg font-semibold">Додання нового завдання</h2>

      {/* Вибір предмета */}
      <Label htmlFor="nameSubject">Виберіть предмет</Label>
      <div className="flex items-center gap-2">
        <Select
          value={selected}
          onValueChange={setSelected}
          name="subject"
          required
        >
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

        {!showInput ? (
          <Button
            size="sm"
            className="w-fit"
            onClick={() => setShowInput(true)}
          >
            Додати предмет
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            <Input
              autoFocus
              type="text"
              placeholder="Назва предмету"
              className="max-w-xs dark:bg-muted"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSubject();
                if (e.key === "Escape") {
                  setNewSubject("");
                  setShowInput(false);
                }
              }}
            />
            <Button size="sm" className="w-fit" onClick={handleAddSubject}>
              Підтвердити
            </Button>
            <Button
              size="sm"
              className="w-fit"
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
      </div>

      {/* Назва завдання */}
      <Label htmlFor="taskName">Введіть відомості про завдання</Label>
      <Input
        type="text"
        id="taskName"
        placeholder="Назва завдання"
        className="max-w-xs dark:bg-muted"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      {/* Дедлайн */}
      <Label htmlFor="taskDateOver">Дедлайн здачі</Label>
      <Input
        type="datetime-local"
        id="taskDateOver"
        className="w-[180px] dark:bg-muted"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {/* Пріоритет */}
      <Label htmlFor="taskPriority">Вкажіть пріоритет</Label>
      <Select
        value={selectedPriority}
        onValueChange={setSelectedPriority}
        name="priority"
        required
      >
        <SelectTrigger className="max-w-xs bg-white">
          <SelectValue placeholder="Оберіть пріоритет" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {priority.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Статус та чекбокс */}
      <Label htmlFor="taskStatus">Статус завдання</Label>
      <div className="flex items-center gap-3">
        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            setSelectedStatus(value);
            setIsDone(value === "Завершено");
          }}
          name="status"
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

      {/* Нотатки */}
      <Label htmlFor="taskNotes">Нотатки</Label>
      <textarea
        id="taskNotes"
        placeholder="Додаткові відомості"
        className="w-full max-w-xs h-20 p-2 border rounded-md dark:bg-muted resize-none"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Кнопка Зберегти */}
      <Button size="sm" className="w-fit mt-2" onClick={handleSaveTask}>
        Зберегти
      </Button>
    </div>
  );
}

export default AddTask;
