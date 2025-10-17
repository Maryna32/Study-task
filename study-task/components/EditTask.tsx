"use client";

import { TaskForm } from "./TaskForm";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTask() {
  const params = useSearchParams();
  const id = params.get("id");
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTask = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) return;
      const res = await fetch(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok)
        setTaskData({
          title: json.task.title,
          deadline: json.task.deadline
            ? new Date(json.task.deadline).toISOString().slice(0, 16)
            : "",
          priority: json.task.priority,
          status: json.task.status,
          done: json.task.done,
          notes: json.task.notes,
          subject: json.task.subject?.name || "",
        });
      else toast.error(json.error || "Помилка при завантаженні");
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (data: any) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) return toast.error("Користувач не авторизований");

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok && json.success) toast.success("Завдання оновлено!");
    else toast.error(json.error || "Помилка при оновленні завдання");
  };

  if (!taskData) return <p>Завантаження...</p>;
  return (
    <TaskForm
      formTitle="Редагування завдання"
      submitLabel="Оновити"
      initialData={taskData}
      onSubmit={handleSubmit}
    />
  );
}
