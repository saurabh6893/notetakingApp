import React, { useState } from "react";

import AnimatedButton from "./AnimatedButton";
import { useTaskStore } from "../stores/useTaskStore";
import { CreateTaskSchema, type CreateTaskInput } from "../schemas/task.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TaskInput() {
  const addTask = useTaskStore((s) => s.addTask);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    await addTask(data.text);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
      <input
        className="border p-2 flex-grow"
        type="text"
        {...register("text")}
        placeholder="New task..."
      />
      <AnimatedButton
        disabled={isSubmitting}
        type="submit"
        className="px-14 bg-blue-500 text-white rounded"
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </AnimatedButton>
      {errors.text && (
        <p className="text-red-500 text-sm">{errors.text.message}</p>
      )}
    </form>
  );
}
