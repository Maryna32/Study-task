import { TaskForm } from "./TaskForm";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function AddTask() {
  const handleSubmit = async (data: any) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) return toast.error("Користувач не авторизований");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    });
    const json = await res.json();
    if (res.ok && json.success) toast.success("Завдання збережено!");
    else toast.error(json.error || "Помилка при збереженні завдання");
  };

  return (
    <TaskForm
      formTitle="Додання нового завдання"
      submitLabel="Зберегти"
      onSubmit={handleSubmit}
    />
  );
}
