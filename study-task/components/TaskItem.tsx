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
  const getStatusBadge = (status: string) => {
    const statusMap = {
      DONE: { text: "Виконано", class: "status-done" },
      IN_PROGRESS: { text: "В процесі", class: "status-in-progress" },
      NOT_STARTED: { text: "Не розпочато", class: "status-not-started" },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.NOT_STARTED;

    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getPriorityIndicator = (priority: string) => {
    const colors = {
      HIGH: "bg-red-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    };

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            colors[priority as keyof typeof colors] || colors.LOW
          }`}
        />
      </div>
    );
  };

  return (
    <TableRow className="align-top  transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {getPriorityIndicator(task.priority)}
          <span className="text-[var(--text)]">{task.title}</span>
        </div>
      </TableCell>
      <TableCell className="text-[var(--text-secondary)]">
        {task.subject?.name || "—"}
      </TableCell>
      <TableCell className="break-words max-w-xs text-[var(--text-secondary)]">
        {task.notes || "—"}
      </TableCell>
      <TableCell>{getStatusBadge(task.status)}</TableCell>
      <TableCell className="text-[var(--text-secondary)]">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task.id)}
            className="hover:text-white transition-colors"
          >
            <Pencil className="h-4 w-4 mr-1" /> Змінити
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="hover:text-white transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Видалити
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
