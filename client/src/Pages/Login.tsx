import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../Components/AnimatedButton";
import { useAuthStore } from "../stores/useAuthStore";
import { useRateLimitStore } from "../stores/useRateLimitStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  type LoginInput,
  AuthResponseSchema,
} from "../schemas/auth.schema";
import { API_BASE } from "../config";

export default function Login() {
  const setToken = useAuthStore((s) => s.setToken);
  const { setLocked: setRateLimitLocked, isLocked } = useRateLimitStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    // Check if already rate limited
    if (isLocked) {
      alert("Too many login attempts. Please wait before trying again.");
      return;
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (res.status === 429) {
      const retryAfter = json.retryAfter || 15; // minutes
      setRateLimitLocked(true, retryAfter);
      return;
    }

    if (!res.ok) {
      alert(json.error || "Login failed");
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
        Login
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            disabled={isLocked || isSubmitting}
            className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLocked || isSubmitting}
            className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <AnimatedButton
          type="submit"
          disabled={isSubmitting || isLocked}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLocked
            ? "🚫 Try Again Later"
            : isSubmitting
              ? "Logging in..."
              : "Login"}
        </AnimatedButton>
      </form>
    </div>
  );
}
