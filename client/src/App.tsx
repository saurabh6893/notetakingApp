import React, { useState } from "react";
import TaskInput from "./Components/TaskInput.js";
import { useTasks } from "./context/TaskContext.js";

export default function App() {
  const { tasks } = useTasks();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskInput />
      <ul className="mt-4 space-y-2">
        {tasks.map((task, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
