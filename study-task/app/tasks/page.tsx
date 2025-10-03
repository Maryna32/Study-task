"use client";
import { Header, Filters, TaskList } from "@/components/index";

function TasksPage() {
  return (
    <div>
      <Header />
      <div className="pl-[30px] pt-[20px]">
        <Filters />
        <TaskList />
      </div>
    </div>
  );
}

export default TasksPage;
