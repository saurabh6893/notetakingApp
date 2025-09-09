import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PageTransition from "./Components/PageTransition";
import { useAuthStore } from "./stores/useAuthStore";
import Tasks from "./Pages/Tasks";
export default function App() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = !!token;
  return (
    <BrowserRouter>
      <Navbar />
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
    </BrowserRouter>
  );
}
