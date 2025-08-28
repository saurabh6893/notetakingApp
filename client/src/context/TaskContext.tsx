// client/src/context/TaskContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import type { FrontendTask, Task } from "../types";
import { API_BASE } from "../config";

export interface TaskContextType {
  tasks: FrontendTask[];
  loading: boolean;
  error: string | null;
  addTask: (text: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  editTask: (id: string, text: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<FrontendTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/tasks`);
        const data: Task[] = await res.json();
        const mapped: FrontendTask[] = data.map((t) => ({
          id: t._id,
          text: t.text,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        setTasks(mapped);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch {
      setError("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const addTask = (text: string) =>
    withLoading(async () => {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const newTask: Task = await res.json();
      setTasks((prev) => [
        ...prev,
        {
          id: newTask._id,
          text: newTask.text,
          createdAt: newTask.createdAt,
          updatedAt: newTask.updatedAt,
        },
      ]);
    });

  const deleteTask = (id: string) =>
    withLoading(async () => {
      await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

  const editTask = (id: string, text: string) =>
    withLoading(async () => {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const updated: Task = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                id: updated._id,
                text: updated.text,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
              }
            : t,
        ),
      );
    });

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, addTask, deleteTask, editTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}



export default TaskContext;
