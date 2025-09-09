import { Link, useNavigate } from "react-router-dom";
import AnimatedButton from "../Components/AnimatedButton";
import { useAuthStore } from "../stores/useAuthStore";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 px-8 py-3 flex gap-6 shadow-md text-white items-center">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      {isAuthenticated && (
        <Link to="/tasks" className="hover:underline">
          Tasks
        </Link>
      )}
      {isAuthenticated ? (
        <AnimatedButton
          className="ml-auto bg-white text-blue-600 px-4 py-1 rounded-lg shadow hover:bg-blue-100 transition"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </AnimatedButton>
      ) : (
        <div className="ml-auto flex gap-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
