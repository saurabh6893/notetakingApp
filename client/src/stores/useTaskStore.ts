import { create } from "zustand";
import type { Task } from "../types";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (text: string) => Promise<void>;
  updateTask: (id: string, text: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await res.json();
      set({ tasks: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTask: async (text) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Add task failed");
      const newTask: Task = await res.json();
      set((state) => ({ tasks: [...state.tasks, newTask], loading: false }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTask: async (id, text) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Update task failed");
      const updatedTask: Task = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  toggleComplete: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/tasks/${id}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Toggle complete failed");
      const updatedTask: Task = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete task failed");
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
