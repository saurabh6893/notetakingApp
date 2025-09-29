import React, { useState } from "react";

import AnimatedButton from "./AnimatedButton";
import { useTaskStore } from "../stores/useTaskStore";
import { CreateTaskSchema } from "../schemas/task.schema";

export default function TaskInput() {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = CreateTaskSchema.safeParse({ text });
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    await addTask(result.data.text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        className="border p-2 flex-grow"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task..."
      />
      <AnimatedButton
        type="submit"
        className="px-14 bg-blue-500 text-white rounded"
      >
        Add
      </AnimatedButton>
      {errors.map((err, i) => (
        <p key={i} className="text-red-600 text-sm">
          {err}
        </p>
      ))}
    </form>
  );
}
