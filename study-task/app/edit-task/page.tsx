"use client";
import { Header, EditTask } from "@/components/index";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function EditTaskPage() {
  return (
    <ProtectedRoute>
      <div>
        <Header />
        <div className="pl-[30px] pt-[20px]">
          <EditTask />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default EditTaskPage;
