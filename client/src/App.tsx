import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import PageTransition from "./Components/PageTransition";

import { Suspense, lazy } from "react";
const Tasks = lazy(() => import("./Pages/Tasks"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));

import { useAuthStore } from "./stores/useAuthStore";
export default function App() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = !!token;
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/tasks"
            element={
              isAuthenticated ? (
                <PageTransition>
                  <Tasks />
                </PageTransition>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
