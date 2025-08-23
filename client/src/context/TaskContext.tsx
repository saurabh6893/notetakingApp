import React, { createContext, useContext, useState } from "react";

interface TaskContextType {
  tasks: string[];
  addTask: (task: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export default function TaskProvidert({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<string[]>([]);
  const addTask = (task: string) => setTasks((prev) => [...prev, task]);
  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProivder");
  }
  return context;
}
