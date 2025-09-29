// client/src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";
import AnimatedButton from "../Components/AnimatedButton";
import { useAuthStore } from "../stores/useAuthStore";
import { LoginSchema } from "../schemas/auth.schema";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message));
      return;
    }
    setErrors([]);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setToken(data.token);
      navigate("/tasks");
    } catch {
      setErrors(["Invalid credentials"]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-blue-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <AnimatedButton
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </AnimatedButton>
        {errors.map((err, i) => (
          <p key={i} className="text-red-600 text-sm">
            {err}
          </p>
        ))}
      </form>
    </div>
  );
}
