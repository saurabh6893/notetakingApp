// client/src/Pages/Tasks.tsx

import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../Components/TaskInput";
import gsap from "gsap";
import { useTasks } from "../context/useTasks";
import AnimatedButton from "../Components/AnimatedButton";
import { GlassCard } from "../Components/GlassCard";

const Tasks: React.FC = () => {
  const { tasks, loading, error, deleteTask, editTask, toggleComplete } =
    useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!loading && listRef.current && tasks.length > 0) {
      const items = Array.from(listRef.current.children) as HTMLElement[];
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { y: -20, x: -200, opacity: 0 },
          {
            duration: 0.2,
            y: 0,
            x: 0,
            opacity: 1,
            stagger: 0.25,
            ease: "power2.out",
          },
        );
      }
    }
  }, [loading, tasks]);

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditText(current);
  };

  const saveEdit = async () => {
    if (editingId && editText.trim()) {
      await editTask(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    gsap.to(e.currentTarget, {
      y: -5,
      boxShadow: "0 10px 15px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      duration: 0.3,
      ease: "power1.out",
    });
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-xl mx-auto mt-8 rounded-2xl bg-white shadow-lg p-8">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          My Tasks
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        {loading && tasks.length === 0 && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="loader rounded-full border-8 border-t-8 border-gray-200 h-16 w-16" />
          </div>
        )}

        <TaskInput />

        <ul ref={listRef} className="mt-4 space-y-5">
          {tasks.map((task) => (
            <li
              key={task.id}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <GlassCard
                accentColor={
                  task.completed
                    ? "var(--color-tertiary)"
                    : "var(--color-primary)"
                }
              >
                {editingId === task.id ? (
                  <div className="flex items-center w-full gap-4">
                    <input
                      className="border p-2 flex-grow rounded"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <AnimatedButton
                      onClick={saveEdit}
                      className="btn btn-primary"
                    >
                      Save
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={cancelEdit}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </AnimatedButton>
                  </div>
                ) : (
                  <div className="flex items-center w-full gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="flex-shrink-0"
                    />
                    <span
                      className={`flex-grow ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                    <div className="flex-shrink-0 flex gap-2">
                      <AnimatedButton
                        onClick={() => startEdit(task.id, task.text)}
                        className="btn btn-primary"
                      >
                        Edit
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={() => deleteTask(task.id)}
                        className="btn btn-secondary"
                      >
                        Delete
                      </AnimatedButton>
                    </div>
                  </div>
                )}
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
