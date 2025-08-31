// client/src/Pages/Tasks.tsx

import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../Components/TaskInput";
import gsap from "gsap";
import { useTasks } from "../context/useTasks";
import AnimatedButton from "../Components/AnimatedButton";

const Tasks: React.FC = () => {
  const { tasks, loading, error, deleteTask, editTask } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!loading && listRef.current && tasks.length > 0) {
      const items = Array.from(listRef.current.children) as HTMLElement[];
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { y: -20, opacity: 0 },
          {
            duration: 0.75,
            y: 0,
            opacity: 1,
            stagger: 0.5,
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
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-xl mx-auto mt-8 rounded-2xl bg-white shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">My Tasks</h1>

        {error && (
          <div className="bg-[#FEE2E2] text-[#B91C1C] p-2 rounded mb-4">
            {error}
          </div>
        )}

        {loading && tasks.length === 0 && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="loader rounded-full border-8 border-t-8 border-gray-200 h-16 w-16" />
          </div>
        )}

        <TaskInput />

        <ul ref={listRef} className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 bg-blue-100 rounded-xl shadow transition-all"
              style={{ cursor: "pointer" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {editingId === task.id ? (
                <>
                  <input
                    className="border p-1 flex-grow mr-2 rounded"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <AnimatedButton
                    onClick={saveEdit}
                    className="px-3 py-1 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition"
                  >
                    Save
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </AnimatedButton>
                </>
              ) : (
                <>
                  <span className="flex-grow">{task.text}</span>
                  <AnimatedButton
                    onClick={() => startEdit(task.id, task.text)}
                    className="px-2 text-[#2563EB] hover:text-[#1E40AF] transition"
                  >
                    Edit
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => deleteTask(task.id)}
                    className="px-2 text-[#DC2626] hover:text-[#B91C1C] transition"
                  >
                    Delete
                  </AnimatedButton>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
