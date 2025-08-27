import React, { createContext, useEffect, useState } from "react";
import type { Task } from "../types";
import { API_BASE } from "../config";

export interface TaskContextType {
  tasks: Task[];
  addTask: (text: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  editTask: (id: string, text: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/tasks`)
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data));
  }, []);

  const addTask = async (text: string) => {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    console.log(res);
    const newTask: Task = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = async (id: string) => {
    await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = async (id: string, text: string) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const updated: Task = await res.json();
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
  };
  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
