"use client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TaskItemProps {
  task: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <TableRow className="align-top">
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell>{task.subject?.name || "—"}</TableCell>
      <TableCell className="break-words max-w-xs">
        {task.notes || "—"}
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            task.status === "DONE"
              ? "bg-green-100 text-green-800"
              : task.status === "IN_PROGRESS"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {task.status === "DONE"
            ? "Виконано"
            : task.status === "IN_PROGRESS"
            ? "В процесі"
            : "Не розпочато"}
        </span>
      </TableCell>
      <TableCell>
        {task.deadline
          ? new Date(task.deadline).toLocaleString("uk-UA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—"}
      </TableCell>
      <TableCell className="text-right pl-6">
        <div className="flex items-center justify-end gap-2 h-full">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task.id)}>
            <Pencil className="h-4 w-4 mr-1" /> Змінити
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Видалити
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
