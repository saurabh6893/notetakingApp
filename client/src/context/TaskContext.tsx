import React, { createContext, useState } from "react";

export interface TaskContextType {
  tasks: string[];
  addTask: (task: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<string[]>([]);
  const addTask = (task: string) => setTasks((prev) => [...prev, task]);
  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
