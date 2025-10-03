"use client";
import { Header, AddTask } from "@/components/index";

function AddTaskPage() {
  return (
    <div>
      <Header />
      <div className="pl-[30px] pt-[20px]">
        <AddTask />{" "}
      </div>
    </div>
  );
}

export default AddTaskPage;
