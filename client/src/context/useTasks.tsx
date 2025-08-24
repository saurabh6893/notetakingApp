import { useContext } from "react";
import TaskContext, { type TaskContextType } from "../context/TaskContext";

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}
