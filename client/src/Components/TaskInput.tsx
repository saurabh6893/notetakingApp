import AnimatedButton from "./AnimatedButton";
import { useTaskStore } from "../stores/useTaskStore";
import { CreateTaskSchema, type CreateTaskInput } from "../schemas/task.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

export default function TaskInput({
  onTaskAdded,
}: {
  onTaskAdded?: () => void;
}) {
  const addTask = useTaskStore((s) => s.addTask);

  const [showTextError, setShowTextError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);
  const textTimerRef = useRef<NodeJS.Timeout | null>(null);
  const descTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
  });

  useEffect(() => {
    if (errors.text) {
      setShowTextError(true);
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
      textTimerRef.current = setTimeout(() => setShowTextError(false), 5000);
    }
    return () => {
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
    };
  }, [errors.text]);

  useEffect(() => {
    if (errors.description) {
      setShowDescError(true);
      if (descTimerRef.current) clearTimeout(descTimerRef.current);
      descTimerRef.current = setTimeout(() => setShowDescError(false), 5000);
    }
    return () => {
      if (descTimerRef.current) clearTimeout(descTimerRef.current);
    };
  }, [errors.description]);

  const onSubmit = async (data: CreateTaskInput) => {
    await addTask(data);
    reset();
    onTaskAdded?.();
  };

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShowTextError(false);
    return e.target.value;
  }
  function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setShowDescError(false);
    return e.target.value;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-2 w-full px-2 items-start"
      style={{ marginTop: 32, marginBottom: 24 }}
    >
      <div className="flex-1 flex flex-col">
        <input
          {...register("text")}
          type="text"
          placeholder="title text..."
          onChange={(e) => {
            register("text").onChange(e);
            handleTextChange(e);
          }}
          className="
          flex-1
          py-3
          px-4
          rounded-xl
          border-[2px]
          border-black
          placeholder:text-black
          text-black
          bg-white
          font-mono
          outline-none
          transition-shadow
          focus:shadow-md
          "
        />
        {errors.text && showTextError && (
          <p className="text-red-500 text-xs mt-2">{errors.text.message}</p>
        )}
      </div>
      <div className="flex-[2] flex flex-col">
        <textarea
          {...register("description")}
          placeholder="task description ......................."
          rows={1}
          onChange={(e) => {
            register("description").onChange(e);
            handleDescChange(e);
          }}
          className="
        flex-[2]
        py-3
        px-4
          rounded-xl
          border-[2px]
          border-black
          placeholder:text-black
          text-black
          bg-white
          font-mono
          outline-none
          resize-none
          transition-shadow
          focus:shadow-md
          "
        />
        {errors.description && showDescError && (
          <p className="text-red-500 text-xs mt-2">
            {errors.description.message}
          </p>
        )}
      </div>
      <AnimatedButton
        disabled={isSubmitting}
        variant="outline"
        size="icon"
        type="submit"
        className="
          rounded-xl
          border-[2px]
          border-black
          bg-white
          text-black
          flex items-center justify-center
          w-12 h-12
          shadow-sm
        "
        aria-label="Add Task"
      >
        <span className="text-2xl font-bold">+</span>
      </AnimatedButton>
    </form>
  );
}
