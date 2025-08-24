// client/src/Pages/Tasks.tsx
import React, { useState } from "react";
import TaskInput from "../Components/TaskInput";
import { useTasks } from "../context/useTasks";

const Tasks: React.FC = () => {
  const { tasks, deleteTask, editTask } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditText(current);
  };

  const saveEdit = async () => {
    if (editingId && editText.trim()) {
      await editTask(editingId, editText);
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <TaskInput />
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center p-2 bg-gray-100 rounded"
          >
            {editingId === task.id ? (
              <>
                <input
                  className="border p-1 flex-grow mr-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={saveEdit}
                  className="px-2 bg-green-500 text-white rounded mr-1"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-grow">{task.text}</span>
                <button
                  onClick={() => startEdit(task.id, task.text)}
                  className="px-2 text-blue-500 hover:underline mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-2 text-red-500 hover:underline"
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
