import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../Components/TaskInput";
import gsap from "gsap";
import { useTasks } from "../context/useTasks";
import AnimatedButton from "../Components/AnimatedButton";
import { GlassCard } from "../Components/GlassCard";
import { cn } from "../lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Layers3,
  Calendar,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import styles from "./Tasks.module.css";

const Tasks: React.FC = () => {
  const { tasks, deleteTask, editTask, toggleComplete } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const stackRef = useRef<HTMLDivElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);
  const bottomCardRef = useRef<HTMLDivElement>(null);
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const wheelLock = useRef(false);

  // Wheel navigation with lock (your existing smooth scrolling)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLock.current || tasks.length === 0) return;
      wheelLock.current = true;

      if (e.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % tasks.length);
      } else if (e.deltaY < 0) {
        setCurrentIndex((prev) => (prev - 1 + tasks.length) % tasks.length);
      }

      setTimeout(() => {
        wheelLock.current = false;
      }, 500);
    };

    const stackElement = stackRef.current;
    if (stackElement) {
      stackElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => stackElement.removeEventListener("wheel", handleWheel);
    }
  }, [tasks.length]);

  // Keyboard navigation (from Lovable)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tasks.length === 0) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % tasks.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + tasks.length) % tasks.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (tasks[currentIndex]) {
          setSelectedId(tasks[currentIndex].id);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, tasks]);

  // GSAP animations for detail cards (with null checks to fix errors)
  useEffect(() => {
    if (gsapTimelineRef.current) gsapTimelineRef.current.kill();

    const topCard = topCardRef.current;
    const bottomCard = bottomCardRef.current;

    if (selectedId) {
      if (!topCard || !bottomCard) return; // Fix null reference errors

      gsap.set([topCard, bottomCard], { display: "block" });
      gsapTimelineRef.current = gsap.timeline();
      gsapTimelineRef.current
        .fromTo(
          topCard,
          { y: "-120%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.7, ease: "power2.out" },
        )
        .fromTo(
          bottomCard,
          { y: "120%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        );
    } else {
      if (!topCard || !bottomCard) return; // Fix null reference errors

      gsapTimelineRef.current = gsap.timeline();
      gsapTimelineRef.current
        .to(topCard, {
          y: "-120%",
          opacity: 0,
          duration: 5,
          ease: "power2.in",
        })
        .to(
          bottomCard,
          {
            y: "120%",
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
          },
          "-=0.4",
        )
        .set([topCard, bottomCard], { display: "none" });
    }

    return () => {
      if (gsapTimelineRef.current) gsapTimelineRef.current.kill();
    };
  }, [selectedId]);

  const saveEdit = async () => {
    if (editingId && editText.trim()) {
      await editTask(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedId);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Beautiful background effects from Lovable */}
      <div className="absolute inset-0 bg-gradient-aurora opacity-5 animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-sunset rounded-full blur-3xl opacity-10 animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Header */}
      <header className="relative z-20 pt-8 pb-6">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4"></div>
          </div>
          <TaskInput />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <GlassCard className="max-w-md mx-auto">
              <div className="text-center">
                <Layers3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
                <p className="text-muted-foreground">
                  Create your first task above to get started with your 3D task
                  stack
                </p>
              </div>
            </GlassCard>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 3D Task Stack */}
            <div className="relative">
              <div
                ref={stackRef}
                className="relative h-[500px] [perspective:1000px]"
              >
                {tasks.map((task, i) => {
                  const adjustedIndex =
                    (i - currentIndex + tasks.length) % tasks.length;
                  const isVisible = adjustedIndex < 5;

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "absolute w-96 h-80 transition-all duration-700 ease-spring cursor-pointer",
                        !isVisible && "opacity-0 pointer-events-none",
                      )}
                      style={{
                        transform: `
                          translateX(${50 + adjustedIndex * 100}px)
                          translateY(${adjustedIndex * 20}px)
                          translateZ(${adjustedIndex * -200}px)
                          rotateX(${adjustedIndex * 145}deg)
                          scale(${1 - adjustedIndex * 0.1})
                        `,
                        zIndex: 100 - adjustedIndex,
                        transformStyle: "preserve-3d",
                      }}
                      onClick={() => setSelectedId(task.id)}
                    >
                      {/* Beautiful task card with Lovable styling */}
                      <GlassCard
                        variant={
                          task.completed
                            ? "blue"
                            : task.id === selectedId
                              ? "purple"
                              : "default"
                        }
                        className={cn(
                          "h-full select-none transition-all duration-500 ease-spring",
                          "hover:shadow-glow hover:scale-105 active:scale-95",
                          task.completed && "opacity-75",
                          task.id === selectedId &&
                            "ring-2 ring-primary/50 shadow-glow",
                        )}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3
                                className={cn(
                                  "text-xl font-bold line-clamp-3 flex-1",
                                  task.completed && "line-through opacity-60",
                                )}
                              >
                                {task.text}
                              </h3>

                              <div
                                className={cn(
                                  "ml-3 p-2 rounded-full transition-all duration-300",
                                  "bg-white/10 backdrop-blur-sm",
                                  task.completed
                                    ? "bg-success/20 text-success"
                                    : "hover:bg-primary/20 text-muted-foreground hover:text-primary",
                                )}
                              >
                                <Check className="h-4 w-4" />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Created{" "}
                                {format(
                                  new Date(task.createdAt || Date.now()),
                                  "MMM d, yyyy",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-center gap-4 mt-8">
                <AnimatedButton
                  variant="glass"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + tasks.length) % tasks.length,
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </AnimatedButton>
                <AnimatedButton
                  variant="glass"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % tasks.length)
                  }
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </AnimatedButton>
              </div>
            </div>

            {/* Right side - GSAP animated detail cards or static details */}
            <div className="relative">
              {selectedTask && (
                <div className="space-y-6 animate-scale-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                      Task Details
                    </h2>
                    <p className="text-muted-foreground">
                      Selected task information and actions
                    </p>
                  </div>

                  {/* Animated top card for title editing */}
                  <div
                    ref={topCardRef}
                    style={{
                      position: "relative",
                      opacity: 0,
                      display: "none",
                    }}
                  >
                    <GlassCard variant="purple" className="animate-slide-down">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                          {editingId === selectedId ? (
                            <input
                              className="bg-transparent border-b-2 border-white/50 px-2 py-1"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              placeholder="Task title..."
                              autoFocus
                            />
                          ) : (
                            selectedTask.text
                          )}
                        </h2>
                        {editingId === selectedId ? (
                          <div className="flex gap-2">
                            <AnimatedButton onClick={saveEdit} variant="glass">
                              Save
                            </AnimatedButton>
                            <AnimatedButton
                              onClick={() => {
                                setEditingId(null);
                                setEditText("");
                              }}
                              variant="ghost"
                            >
                              Cancel
                            </AnimatedButton>
                          </div>
                        ) : (
                          <AnimatedButton
                            onClick={() => {
                              setEditingId(selectedId);
                              setEditText(selectedTask.text);
                            }}
                            variant="glass"
                          >
                            Edit Title
                          </AnimatedButton>
                        )}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Animated bottom card for actions */}
                  <div
                    ref={bottomCardRef}
                    style={{
                      position: "relative",
                      opacity: 0,
                      display: "none",
                    }}
                  >
                    <GlassCard variant="sunset" className="animate-slide-up">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Task Actions
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Status:{" "}
                              {selectedTask.completed
                                ? "Completed"
                                : "In Progress"}
                            </span>
                            <span>•</span>
                            <span>
                              Created:{" "}
                              {format(
                                new Date(selectedTask.createdAt || Date.now()),
                                "MMM d, yyyy",
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                          <AnimatedButton
                            variant="glass"
                            onClick={() => toggleComplete(selectedTask.id)}
                            className={cn(
                              "transition-colors",
                              selectedTask.completed
                                ? "bg-success/20 text-success"
                                : "",
                            )}
                          >
                            {selectedTask.completed
                              ? "Mark Incomplete"
                              : "Mark Complete"}
                          </AnimatedButton>

                          <AnimatedButton
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Delete this task?")) {
                                deleteTask(selectedTask.id);
                                setSelectedId(null);
                              }
                            }}
                          >
                            Delete Task
                          </AnimatedButton>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <AnimatedButton
                    variant="ghost"
                    onClick={() => setSelectedId(null)}
                    className="w-full"
                  >
                    Close Details
                  </AnimatedButton>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
