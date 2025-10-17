"use client";
import { Header, EditTask } from "@/components/index";

function EditTaskPage() {
  return (
    <div>
      <Header />
      <div className="pl-[30px] pt-[20px]">
        <EditTask />
      </div>
    </div>
  );
}

export default EditTaskPage;
