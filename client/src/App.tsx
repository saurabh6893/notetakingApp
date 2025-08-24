import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTasks } from "./context/useTasks";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Tasks from "./Pages/Tasks";

export default function App() {
  const { tasks } = useTasks();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}
