import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../Components/TaskInput";
import { useTasks } from "../context/useTasks";
import AnimatedButton from "../Components/AnimatedButton";
import { GlassCard } from "../Components/GlassCard";
import styles from "./Tasks.module.css";

const Tasks: React.FC = () => {
  const { tasks, deleteTask, editTask, toggleComplete } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && currentIndex < tasks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    const stackElement = stackRef.current;
    if (stackElement) {
      stackElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => stackElement.removeEventListener("wheel", handleWheel);
    }
  }, [currentIndex, tasks.length]);

  const saveEdit = async () => {
    if (editingId && editText.trim()) {
      await editTask(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  return (
    <>
      <div className={styles.inputBar}>
        <TaskInput />
      </div>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div ref={stackRef} className={styles.cardStack}>
            {tasks.map((task, i) => {
              const adjustedIndex =
                (i - currentIndex + tasks.length) % tasks.length;
              return (
                <div
                  key={task.id}
                  className={styles.stackCard}
                  style={{
                    transform: `
        translateZ(${adjustedIndex * -400}px)    
        rotateY(${adjustedIndex * 0}deg) 
        translateX(${adjustedIndex * 200}px)     
   `,
                    zIndex: tasks.length - adjustedIndex,
                    transitionDuration: "0.8s",
                  }}
                  onClick={() => setSelectedId(task.id)}
                >
                  <div className="w-full h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-4">{task.text}</h3>
                    {adjustedIndex === 0 && (
                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                            className="scale-125"
                          />
                          <span className="text-sm">Mark as completed</span>
                        </div>
                        <div className="flex gap-2">
                          <AnimatedButton
                            onClick={() => deleteTask(task.id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            Delete
                          </AnimatedButton>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.content}>
          {selectedId ? (
            <div className={styles.detailCard}>
              <GlassCard accentColor="var(--color-secondary)">
                {editingId === selectedId ? (
                  <div className="flex flex-col gap-4">
                    <input
                      className="border p-2 rounded"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <AnimatedButton
                        onClick={saveEdit}
                        className="btn btn-primary"
                      >
                        Save
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </AnimatedButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold">
                        {tasks.find((t) => t.id === selectedId)?.text}
                      </h2>
                      <AnimatedButton
                        onClick={() => {
                          setEditingId(selectedId);
                          setEditText(
                            tasks.find((t) => t.id === selectedId)!.text,
                          );
                        }}
                        className="btn btn-primary"
                      >
                        Edit
                      </AnimatedButton>
                    </div>
                    <p className="mt-4 text-lg">
                      Detailed description for the selected task goes here.
                    </p>
                  </>
                )}
              </GlassCard>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Select a task to view details
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
