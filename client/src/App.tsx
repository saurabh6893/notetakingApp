import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Tasks from "./Pages/Tasks";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PageTransition from "./Components/PageTransition";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./styles/theme.css";

export default function App() {
  const { token } = useContext(AuthContext);
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
        {token && (
          <Route
            path="/tasks"
            element={
              <PageTransition>
                <Tasks />
              </PageTransition>
            }
          />
        )}
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
