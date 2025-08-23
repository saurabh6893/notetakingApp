import React, { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext.js";

export default function TaskInput() {
  const { addTask } = useTasks();

  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Task text:", text);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTask(text);
      setText("");
    }
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
      <button type="submit" className="px-4 bg-blue-500 text-white rounded">
        Add
      </button>
    </form>
  );
}
