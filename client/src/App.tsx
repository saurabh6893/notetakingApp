import React, { useState } from "react";
import TaskInput from "./Components/TaskInput.js";

export default function App() {
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = (task: string) => {
    setTasks((prev) => [...prev, task]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Task Manager</h1>
      <TaskInput onAdd={addTask} />
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
