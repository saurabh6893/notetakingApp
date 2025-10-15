import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../Components/AnimatedButton";
import { useAuthStore } from "../stores/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterInput,
  AuthResponseSchema,
} from "../schemas/auth.schema";
import { API_BASE } from "../config";

export default function Register() {
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json?.error ?? "Registration failed");
      return;
    }

    const parsed = AuthResponseSchema.safeParse(json);
    if (!parsed.success) {
      alert("Unexpected server response");
      return;
    }

    setToken(parsed.data.token);
    navigate("/tasks");
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Register
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <AnimatedButton
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </AnimatedButton>
      </form>
    </div>
  );
}
