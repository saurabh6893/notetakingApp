import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTasks } from "./context/useTasks";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Tasks from "./Pages/Tasks";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

export default function App() {
  const { tasks } = useTasks();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
