"use client";
import { Header, Filters, TaskList } from "@/components/index";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function TasksPage() {
  const router = useRouter();
  const goToAddTasks = () => {
    router.push("/add-task");
  };
  return (
    <ProtectedRoute>
      <div>
        <Header />
        <div className="pl-[30px] pt-[20px]">
          <Filters />
          <TaskList />
          <Button
            size="sm"
            className="w-fit mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] mb-[2-px]"
            onClick={goToAddTasks}
          >
            Додати завдання
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default TasksPage;
