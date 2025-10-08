"use client";
import { Header, Filters, TaskList } from "@/components/index";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";

function TasksPage() {
  const router = useRouter();
  const goToAddTasks = () => {
    router.push("/add-task");
  };
  return (
    <div>
      <Header />
      <div className="pl-[30px] pt-[20px]">
        <Filters />
        <TaskList />
        <Button size="sm" className="w-fit mt-2" onClick={goToAddTasks}>
          Додати завдання
        </Button>
      </div>
    </div>
  );
}

export default TasksPage;
