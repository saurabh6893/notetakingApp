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
    await addTask(data);
    reset();
  };

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
        {errors.text && (
          <p className="text-red-500 text-sm">{errors.text.message}</p>
        )}
      </div>
      <div className="flex-[2] flex flex-col">
        <textarea
          {...register("description")}
          placeholder="task description ......................."
          rows={1}
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
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
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
