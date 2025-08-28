// client/src/Pages/Tasks.tsx

import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../Components/TaskInput";
import gsap from "gsap";
import { useTasks } from "../context/useTasks";

const Tasks: React.FC = () => {
  const { tasks, loading, error, addTask, deleteTask, editTask } = useTasks();
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

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>

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
            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
            style={{ opacity: 1 }}
          >
            {editingId === task.id ? (
              <>
                <input
                  className="border p-1 flex-grow mr-2 rounded"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-grow">{task.text}</span>
                <button
                  onClick={() => startEdit(task.id, task.text)}
                  className="px-2 text-[#2563EB] hover:text-[#1E40AF] transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-2 text-[#DC2626] hover:text-[#B91C1C] transition"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
