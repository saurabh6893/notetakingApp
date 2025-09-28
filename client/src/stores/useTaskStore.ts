import { create } from "zustand";
import type { Task } from "../types";
import { API_BASE } from "../config";
import { useAuthStore } from "./useAuthStore";

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

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        set({ tasks: [], error: "Session expired", loading: false });
        return;
      }

      if (!res.ok) {
        set({ tasks: [], error: `Error: ${res.status}`, loading: false });
        return;
      }

      const text = await res.text();
      try {
        const data: Task[] = JSON.parse(text);
        set({ tasks: Array.isArray(data) ? data : [], loading: false });
      } catch {
        set({ tasks: [], error: text, loading: false });
      }
    } catch (error) {
      set({ tasks: [], error: (error as Error).message, loading: false });
    }
  },

  addTask: async (text) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: getAuthHeaders(),
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
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ text }),
        headers: getAuthHeaders(), // ✅ ADDED AUTH
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
      const res = await fetch(`${API_BASE}/api/tasks/${id}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders(), // ✅ ADDED AUTH
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
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(), // ✅ ADDED AUTH
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
