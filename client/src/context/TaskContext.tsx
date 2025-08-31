// client/src/context/TaskContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import type { FrontendTask, Task } from "../types";
import { API_BASE } from "../config";
import { AuthContext } from "./AuthContext";

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
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setTasks([]);
      return;
    }
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, [token]);

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

  const editTask = (id: string, text: string) =>
    withLoading(async () => {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Edit failed");
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
