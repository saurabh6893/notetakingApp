import React, { useState } from "react";

import AnimatedButton from "./AnimatedButton";
import { useTaskStore } from "../stores/useTaskStore";

export default function TaskInput() {
  const [text, setText] = useState("");
  const addTask = useTaskStore((state) => state.addTask);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addTask(text);
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
    </form>
  );
}
