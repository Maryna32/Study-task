"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskItem from "./TaskItem";
import { useRouter } from "next/navigation";

function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const raw = localStorage.getItem("sb-enwjskgehaagktyijvzj-auth-token");

        if (!raw) {
          setError("Користувач не авторизований");
          setLoading(false);
          return;
        }

        const data = JSON.parse(raw);

        const token =
          data?.access_token ||
          data?.currentSession?.access_token ||
          data?.session?.access_token;

        if (!token) {
          console.log("STRUCTURE:", data);
          setError("Не вдалося знайти access_token");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Помилка при отриманні завдань");
        } else {
          setTasks(json.tasks || []);
        }
      } catch (err) {
        console.error(err);
        setError("Помилка з'єднання з сервером");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (taskId: string) => {
    router.push(`/edit-task?id=${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це завдання?")) return;

    const raw = localStorage.getItem("sb-enwjskgehaagktyijvzj-auth-token");
    if (!raw) return;

    const data = JSON.parse(raw);
    const token =
      data?.access_token ||
      data?.currentSession?.access_token ||
      data?.session?.access_token;

    if (!token) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        const error = await res.json();
        alert(error.error || "Помилка при видаленні завдання");
      }
    } catch (err) {
      console.error(err);
      alert("Помилка при видаленні завдання");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="font-extrabold text-[28px] mb-4">Список завдань</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">Завдань поки немає</p>
      ) : (
        <div className="border rounded-lg w-fit">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва</TableHead>
                <TableHead>Предмет</TableHead>
                <TableHead>Нотатки</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дедлайн</TableHead>
                <TableHead className="text-center">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default TaskList;
