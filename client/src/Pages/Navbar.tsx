import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AnimatedButton from "../Components/AnimatedButton";

const Navbar: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 px-8 py-3 flex gap-6 shadow-md text-white font-semibold items-center">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      {token && (
        <Link to="/tasks" className="hover:underline">
          Tasks
        </Link>
      )}
      {token ? (
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
};
export default Navbar;
