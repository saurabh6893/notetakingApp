import { create } from "zustand";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types";
import { API_BASE } from "../config";
import { useAuthStore } from "./useAuthStore";
import { CreateTaskSchema, UpdateTaskSchema } from "../schemas/task.schema";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskInput) => Promise<void>;
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
      const res = await fetch(`${API_BASE}/tasks`, {
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

      const data: Task[] = await res.json();
      set({ tasks: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ tasks: [], error: (error as Error).message, loading: false });
    }
  },

  addTask: async (payload) => {
    // const snapshot = get().tasks;
    const snapshot = useTaskStore.getState().tasks;

    const validation = CreateTaskSchema.safeParse(payload);
    if (!validation.success) {
      set({ error: validation.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const tempTask: Task = {
      ...validation.data,
      _id: "temp-" + Date.now(),
      completed: false,
      userId: "optimistic-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [...state.tasks, tempTask],
      loading: true,
      error: null,
    }));
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        body: JSON.stringify(validation.data),
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Add task failed");

      const newTask: Task = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === tempTask._id ? newTask : t)),
        loading: false,
      }));
    } catch (error) {
      set({ tasks: snapshot, error: (error as Error).message, loading: false });
    }
  },

  updateTask: async (id, payload: UpdateTaskInput) => {
    const snapshot = useTaskStore.getState().tasks;
    const validation = UpdateTaskSchema.safeParse(payload);
    if (!validation.success) {
      set({
        error:
          validation.error.issues[0]?.message || "Unknown validation error",
      });
      return;
    }
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id ? { ...t, ...validation.data } : t,
      ),
    }));
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(validation.data),
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Update task failed");

      const updatedTask: Task = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
        loading: false,
      }));
    } catch (error) {
      set({ tasks: snapshot, error: (error as Error).message, loading: false });
    }
  },

  toggleComplete: async (id) => {
    const snapshot = useTaskStore.getState().tasks;
    set({ loading: true, error: null });
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id ? { ...t, completed: !t.completed } : t,
      ),
    }));
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Toggle complete failed");

      const updatedTask: Task = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
        loading: false,
      }));
    } catch (error) {
      set({ tasks: snapshot, error: (error as Error).message, loading: false });
    }
  },

  removeTask: async (id) => {
    const snapshot = useTaskStore.getState().tasks;
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Delete task failed");

      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ tasks: snapshot, error: (error as Error).message, loading: false });
    }
  },
}));
