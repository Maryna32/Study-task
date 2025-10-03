"use client";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";

function AddTask() {
  const subjects = ["Математика", "Фізика", "Хімія", "Історія", "Англійська"];

  const [selected, setSelected] = useState(subjects[0]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="nameSubject">Виберіть предмет</Label>
      <Select
        value={selected}
        onValueChange={setSelected}
        name="subject"
        required
      >
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Оберіть предмет" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span>Якщо його тут немає, додайте</span>

      <Button
        size="lg"
        className="capitalize"
        onClick={() => console.log("Додати предмет")}
      >
        Додати предмет
      </Button>
      {/* <Input
        type="text"
        id="nameSubject"
        placeholder="Назва предмету"
        className="max-w-xs dark:bg-muted"
        onChange={(e) => {}}
      /> */}
    </div>
  );
}

export default AddTask;
