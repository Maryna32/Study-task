"use client";
import { Header, AddTask } from "@/components/index";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function AddTaskPage() {
  return (
    <ProtectedRoute>
      <div>
        <Header />
        <div className="pl-[30px] pt-[20px]">
          <AddTask />{" "}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AddTaskPage;
