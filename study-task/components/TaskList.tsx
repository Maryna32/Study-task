import { TaskItem } from "./index.js";

function TaskList() {
  return (
    <div>
      <h2 className="font-extrabold text-[28px]"> Список завдань</h2>
      <TaskItem />
    </div>
  );
}

export default TaskList;
